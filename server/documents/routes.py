from flask import Blueprint, jsonify, request, g
import uuid
from datetime import datetime

from server.config import supabase, s3_client, S3_BUCKET_NAME
from server.auth.utils import token_required

documents_bp = Blueprint('documents_bp', __name__, url_prefix='/api/documents')

@documents_bp.route('/create', methods=['POST'])
@token_required
def create_document():
    """Creates a new document."""
    try:
        user_id = g.current_user_id       
        document_id = str(uuid.uuid4())
        
        s3_object_key = f"user_documents/{user_id}/{document_id}.txt"
        
        document_data = {
            'id': document_id,
            'user_id': user_id,
            'title': 'Untitled',
            's3_object_key': s3_object_key,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        result = supabase.table('documents').insert(document_data).execute()
        
        created_document = result.data[0] if result.data else None
        
        if not created_document:
            return jsonify({'error': 'Failed to create document'}), 500
        
        return jsonify({
            'message': 'Document created successfully',
            'document': {
                'id': created_document['id'],
                'title': created_document['title'],
                'user_id': created_document['user_id'],
                's3_object_key': created_document['s3_object_key'],
                'created_at': created_document['created_at'],
                'updated_at': created_document['updated_at']
            }
        }), 201
        
    except Exception as e:
        print(f"Error creating document: {str(e)}")
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/', methods=['GET'])
@token_required
def get_user_documents():
    """Retrieves all documents for the authenticated user."""
    try:
        user_id = g.current_user_id
        
        # Query Supabase for all documents belonging to the user
        # Order by updated_at in descending order (newest first)
        result = supabase.table('documents') \
            .select('*') \
            .eq('user_id', user_id) \
            .order('updated_at', desc=True) \
            .execute()
        
        # Extract the documents from the result
        documents = result.data if result.data else []
        
        return jsonify({
            'documents': documents,
            'count': len(documents)
        }), 200
        
    except Exception as e:
        print(f"Error fetching documents: {str(e)}")
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/<document_id>/metadata', methods=['PUT'])
@token_required
def update_document_metadata(document_id):
    """Updates document metadata (title, updated_at)."""
    try:
        user_id = g.current_user_id
        data = request.json
        
        # Check if document exists and belongs to user
        doc_result = supabase.table('documents') \
            .select('*') \
            .eq('id', document_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not doc_result.data:
            return jsonify({'error': 'Document not found or not authorized'}), 404
        
        # Get title from request
        title = data.get('title')
        if not title:
            title = "Untitled"
        
        # Update document metadata in database
        update_data = {
            'title': title,
            'updated_at': datetime.now().isoformat()
        }
        
        # Update document in database
        update_result = supabase.table('documents') \
            .update(update_data) \
            .eq('id', document_id) \
            .execute()
            
        return jsonify({
            'message': 'Document metadata updated successfully',
            'document': update_result.data[0] if update_result.data else None
        }), 200
        
    except Exception as e:
        print(f"Error updating document metadata: {str(e)}")
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/<document_id>/content', methods=['PUT'])
@token_required
def update_document_content(document_id):
    """Updates document content in S3 bucket."""
    try:
        user_id = g.current_user_id
        content = request.data.decode('utf-8')

        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        preview = content[:250] + '...' if len(content) > 250 else content
        
        # Check if document exists and belongs to user
        doc_result = supabase.table('documents') \
            .select('*') \
            .eq('id', document_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not doc_result.data:
            return jsonify({'error': 'Document not found or not authorized'}), 404
        
        document = doc_result.data[0]
        s3_object_key = document['s3_object_key']
        
        # Upload content to S3
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_object_key,
            Body=content,
            ContentType='text/plain'
        )
        
        # Update document with preview and timestamp
        supabase.table('documents') \
            .update({
                'updated_at': datetime.now().isoformat(),
                'preview': preview
            }) \
            .eq('id', document_id) \
            .execute()
        
        return jsonify({
            'message': 'Document content updated successfully',
            'document_id': document_id
        }), 200
        
    except Exception as e:
        print(f"Error updating document content: {str(e)}")
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/<document_id>/content', methods=['GET'])
@token_required
def get_document_content(document_id):
    """Retrieves document content from S3 bucket."""
    try:
        user_id = g.current_user_id
        
        # Check if document exists and belongs to user
        doc_result = supabase.table('documents') \
            .select('*') \
            .eq('id', document_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not doc_result.data:
            return jsonify({'error': 'Document not found or not authorized'}), 404
        
        document = doc_result.data[0]
        s3_object_key = document['s3_object_key']
        
        # Get file from S3
        from server.config import s3_client, S3_BUCKET_NAME
        
        try:
            response = s3_client.get_object(
                Bucket=S3_BUCKET_NAME,
                Key=s3_object_key
            )
            content = response['Body'].read().decode('utf-8')
            
            return jsonify({
                'content': content,
                'document': document
            }), 200
            
        except s3_client.exceptions.NoSuchKey:
            # Document exists in DB but not in S3 yet
            return jsonify({
                'content': '',
                'document': document
            }), 200
            
    except Exception as e:
        print(f"Error fetching document content: {str(e)}")
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/<document_id>', methods=['DELETE'])
@token_required
def delete_document(document_id):
    """Deletes a document and its content from S3."""
    try:
        user_id = g.current_user_id
        
        # Check if document exists and belongs to user
        doc_result = supabase.table('documents') \
            .select('*') \
            .eq('id', document_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not doc_result.data:
            return jsonify({'error': 'Document not found or not authorized'}), 404
        
        document = doc_result.data[0]
        s3_object_key = document['s3_object_key']
        
        # Delete document content from S3
        s3_client.delete_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_object_key
        )
        
        # Delete document record from database
        supabase.table('documents') \
            .delete() \
            .eq('id', document_id) \
            .execute()
        
        return jsonify({
            'message': 'Document deleted successfully',
            'document_id': document_id
        }), 200
        
    except Exception as e:
        print(f"Error deleting document: {str(e)}")
        return jsonify({'error': str(e)}), 500


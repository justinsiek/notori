from flask import Blueprint, jsonify, request, g
import uuid
from datetime import datetime

from server.config import supabase
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
    
    

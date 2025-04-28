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
    
    

import pathlib

def get_system_prompt():
    current_dir = pathlib.Path(__file__).parent
    system_prompt_path = current_dir / 'systemprompt.txt'
    try:
        with open(system_prompt_path, 'r') as file:
            return file.read()
    except Exception as e:
        print(f"Error loading system prompt: {e}")
        return None


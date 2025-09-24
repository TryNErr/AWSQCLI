from openai import OpenAI
import os
import glob

client = OpenAI()

os.makedirs('prompt/output', exist_ok=True)

prompt_files = glob.glob('prompt/*.txt')

for prompt_file in prompt_files:
    with open(prompt_file, 'r', encoding='utf-8') as f:
        prompt_content = f.read()
    
    response = client.chat.completions.create( 
        messages=[
            {"role": "system", "content": "You must respond with valid JSON format only. Ensure all output is properly formatted JSON and encoded in UTF-8."},
            {"role": "user", "content": prompt_content}
        ],
        model="openai.gpt-oss-20b-1:0",
        stream=True
    )
    
    # Change extension to .json
    base_name = os.path.splitext(os.path.basename(prompt_file))[0]
    output_filename = f"prompt/output/response_{base_name}.json"
    
    with open(output_filename, 'w', encoding='utf-8') as output_file:
        for item in response:
            if item.choices[0].delta.content:
                output_file.write(item.choices[0].delta.content)
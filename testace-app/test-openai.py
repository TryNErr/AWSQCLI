from openai import OpenAI
import os
import glob

client = OpenAI()

os.makedirs('prompt/output', exist_ok=True)

prompt_files = glob.glob('prompt/*.txt')

for prompt_file in prompt_files:
    with open(prompt_file, 'r') as f:
        prompt_content = f.read()
    
    response = client.chat.completions.create( 
        messages=[{ "role": "user", "content": prompt_content }],
        model="openai.gpt-oss-20b-1:0",
        stream=True
    )
    
    output_filename = f"prompt/output/response_{os.path.basename(prompt_file)}"
    
    with open(output_filename, 'w') as output_file:
        for item in response:
            if item.choices[0].delta.content:
                output_file.write(item.choices[0].delta.content)
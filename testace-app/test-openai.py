from openai import OpenAI
import os
import glob
import json
import re

client = OpenAI()

os.makedirs('prompt/output', exist_ok=True)

prompt_files = glob.glob('prompt/*.txt')

for prompt_file in prompt_files:
    with open(prompt_file, 'r', encoding='utf-8') as f:
        prompt_content = f.read()
    
    response = client.chat.completions.create( 
        messages=[
            {"role": "system", "content": "You must respond with ONLY valid JSON format. Do not include any reasoning, explanations, or text outside the JSON. Start your response with { and end with }. No other text is allowed."},
            {"role": "user", "content": prompt_content}
        ],
        model="openai.gpt-oss-20b-1:0",
        stream=True
    )
    
    # Collect full response
    full_response = ""
    for item in response:
        if item.choices[0].delta.content:
            full_response += item.choices[0].delta.content
    
    # Extract JSON only
    json_match = re.search(r'\{.*\}', full_response, re.DOTALL)
    json_only = json_match.group(0) if json_match else full_response
    
    base_name = os.path.splitext(os.path.basename(prompt_file))[0]
    output_filename = f"prompt/output/response_{base_name}.json"
    
    with open(output_filename, 'w', encoding='utf-8') as output_file:
        output_file.write(json_only)
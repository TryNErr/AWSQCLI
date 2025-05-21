#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import random
import time
import json
import os
from termcolor import colored
import emoji

# Language support
LANGUAGES = {
    "english": "en",
    "hindi": "hi",
    "gujarati": "gu"
}

# Load language data
def load_language_data(lang_code):
    try:
        with open(f"language_data_{lang_code}.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Language data for {lang_code} not found. Defaulting to English.")
        with open("language_data_en.json", "r", encoding="utf-8") as file:
            return json.load(file)

# Load country data
def load_countries():
    try:
        with open("country_data.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print("Country data file not found. Creating a sample dataset.")
        return create_sample_countries()

def create_sample_countries():
    # Sample data with just a few countries
    return {
        "india": {
            "names": {
                "en": "India",
                "hi": "भारत",
                "gu": "ભારત"
            },
            "flag": ":flag_in:",
            "hints": {
                "en": [
                    "This country is the seventh-largest by area.",
                    "It's home to the Taj Mahal.",
                    "It has the second-largest population in the world.",
                    "Cricket is the most popular sport here.",
                    "It's known for its diverse cuisine and spices."
                ],
                "hi": [
                    "यह देश क्षेत्रफल के हिसाब से सातवां सबसे बड़ा है।",
                    "यहां ताजमहल स्थित है।",
                    "इसकी जनसंख्या विश्व में दूसरे स्थान पर है।",
                    "क्रिकेट यहां का सबसे लोकप्रिय खेल है।",
                    "यह अपने विविध व्यंजनों और मसालों के लिए जाना जाता है।"
                ],
                "gu": [
                    "આ દેશ વિસ્તારની દ્રષ્ટિએ સાતમો સૌથી મોટો છે.",
                    "તાજમહેલ અહીં સ્થિત છે.",
                    "તેની વસ્તી વિશ્વમાં બીજા ક્રમે છે.",
                    "ક્રિકેટ અહીંનો સૌથી લોકપ્રિય રમત છે.",
                    "તે તેના વિવિધ વ્યંજનો અને મસાલાઓ માટે જાણીતું છે."
                ]
            },
            "info": {
                "en": ["Capital: New Delhi", "Currency: Indian Rupee", "Official Languages: Hindi, English"],
                "hi": ["राजधानी: नई दिल्ली", "मुद्रा: भारतीय रुपया", "आधिकारिक भाषाएँ: हिंदी, अंग्रेजी"],
                "gu": ["રાજધાની: નવી દિલ્હી", "ચલણ: ભારતીય રૂપિયો", "સત્તાવાર ભાષાઓ: હિન્દી, અંગ્રેજી"]
            }
        },
        "japan": {
            "names": {
                "en": "Japan",
                "hi": "जापान",
                "gu": "જાપાન"
            },
            "flag": ":flag_jp:",
            "hints": {
                "en": [
                    "This island country is located in East Asia.",
                    "It's known for cherry blossoms and Mount Fuji.",
                    "It's a global leader in robotics and technology.",
                    "Sumo is one of its traditional sports.",
                    "It's home to anime and manga culture."
                ],
                "hi": [
                    "यह द्वीप देश पूर्वी एशिया में स्थित है।",
                    "यह चेरी ब्लॉसम और माउंट फुजी के लिए जाना जाता है।",
                    "यह रोबोटिक्स और प्रौद्योगिकी में वैश्विक नेता है।",
                    "सुमो इसके पारंपरिक खेलों में से एक है।",
                    "यह एनिमे और मंगा संस्कृति का घर है।"
                ],
                "gu": [
                    "આ દ્વીપ દેશ પૂર્વ એશિયામાં સ્થિત છે.",
                    "તે ચેરી બ્લોસમ અને માઉન્ટ ફુજી માટે જાણીતું છે.",
                    "તે રોબોટિક્સ અને ટેકનોલોજીમાં વૈશ્વિક નેતા છે.",
                    "સુમો તેની પરંપરાગત રમતોમાંની એક છે.",
                    "તે એનિમે અને મંગા સંસ્કૃતિનું ઘર છે."
                ]
            },
            "info": {
                "en": ["Capital: Tokyo", "Currency: Japanese Yen", "Official Language: Japanese"],
                "hi": ["राजधानी: टोक्यो", "मुद्रा: जापानी येन", "आधिकारिक भाषा: जापानी"],
                "gu": ["રાજધાની: ટોક્યો", "ચલણ: જાપાની યેન", "સત્તાવાર ભાષા: જાપાની"]
            }
        }
    }

class CountryPuzzleGame:
    def __init__(self, language="en"):
        self.language = language
        self.lang_data = load_language_data(language)
        self.countries = load_countries()
        self.score = 0
        self.total_time = 0
        self.rounds_played = 0
        self.game_over = False
        self.tries_remaining = 3
        
    def display_title(self):
        os.system('clear' if os.name == 'posix' else 'cls')
        print(colored("*" * 60, 'cyan'))
        print(colored(f"*{self.lang_data['game_title']:^58}*", 'cyan'))
        print(colored("*" * 60, 'cyan'))
        print(colored(self.lang_data["welcome_message"], 'green'))
        print(colored("=" * 60, 'yellow'))
        
    def select_random_countries(self, count=5):
        """Select random countries for options"""
        available_countries = list(self.countries.keys())
        if len(available_countries) < count:
            count = len(available_countries)
        return random.sample(available_countries, count)
        
    def play_round(self):
        """Play a single round of the game"""
        if self.game_over:
            self.show_game_over()
            return
            
        selected_countries = self.select_random_countries()
        correct_country = random.choice(selected_countries)
        country_data = self.countries[correct_country]
        
        hints = country_data["hints"][self.language]
        max_hints = len(hints)
        
        print(colored(self.lang_data["new_round"], 'magenta'))
        print(colored(self.lang_data["instructions"], 'yellow'))
        
        start_time = time.time()
        correct_guess = False
        self.tries_remaining = 3  # Reset tries for new round
        current_hint_index = 0
        
        # Display options with flags
        print(colored(self.lang_data["options"], 'cyan'))
        for i, country in enumerate(selected_countries, 1):
            flag = self.countries[country]["flag"]
            translated_name = self.countries[country]["names"][self.language]
            print(f"{i}. {emoji.emojize(flag)} {translated_name}")
        
        while current_hint_index < len(hints) and self.tries_remaining > 0 and not correct_guess:
            print(colored(f"\n{self.lang_data['hint']} {current_hint_index + 1}/{max_hints}:", 'green'))
            print(colored(hints[current_hint_index], 'white'))
            
            # Display tries remaining
            tries_color = 'red' if self.tries_remaining == 1 else 'yellow'
            print(colored(f"Tries remaining: {self.tries_remaining}", tries_color))
            
            # Get user guess
            while True:
                try:
                    guess = int(input(colored(self.lang_data["make_guess"], 'yellow')))
                    if 1 <= guess <= len(selected_countries):
                        break
                    else:
                        print(colored(self.lang_data["invalid_choice"], 'red'))
                except ValueError:
                    print(colored(self.lang_data["invalid_input"], 'red'))
            
            # Check if guess is correct
            if selected_countries[guess-1] == correct_country:
                correct_guess = True
                end_time = time.time()
                time_taken = end_time - start_time
                
                # Calculate points (more points for fewer hints and faster guessing)
                hint_factor = (max_hints - current_hint_index) / max_hints
                time_factor = max(0, 1 - (time_taken / 60))  # Time factor decreases as time increases
                points = int((hint_factor * 70 + time_factor * 30) * 10)
                
                self.score += points
                self.total_time += time_taken
                self.rounds_played += 1
                
                print(colored(self.lang_data["correct_guess"], 'green'))
                print(colored(f"{self.lang_data['points_earned']}: {points}", 'cyan'))
                print(colored(f"{self.lang_data['time_taken']}: {time_taken:.2f} {self.lang_data['seconds']}", 'cyan'))
                
                # Display country info
                print(colored("\n" + "=" * 40, 'yellow'))
                print(colored(f"{self.lang_data['country_info']} {self.countries[correct_country]['names'][self.language]}:", 'magenta'))
                for info in self.countries[correct_country]["info"][self.language]:
                    print(colored(f"• {info}", 'white'))
                print(colored("=" * 40, 'yellow'))
                
                print(colored("Next country in 3 seconds...", 'magenta'))
                time.sleep(3)  # Pause before next round
                
            else:
                self.tries_remaining -= 1
                if self.tries_remaining > 0:
                    # Show next hint if available and there are tries remaining
                    if current_hint_index < max_hints - 1:
                        current_hint_index += 1
                        print(colored(f"{self.lang_data['wrong_guess']} {self.tries_remaining} tries remaining.", 'red'))
                    else:
                        print(colored(f"Wrong! No more hints. {self.tries_remaining} tries remaining.", 'red'))
                else:
                    # Game over after 3 wrong tries
                    print(colored(f"{self.lang_data['wrong_guess']} {self.lang_data['correct_answer']} {self.countries[correct_country]['names'][self.language]}.", 'red'))
                    self.rounds_played += 1
                    self.game_over = True
                    print(colored("Game over! You've used all your tries.", 'red'))
                    time.sleep(2)  # Pause before showing game over screen
                
        if not correct_guess and not self.game_over:
            print(colored(self.lang_data["no_more_hints"], 'red'))
            print(colored(f"{self.lang_data['correct_answer']}: {self.countries[correct_country]['names'][self.language]}", 'green'))
            self.rounds_played += 1
            
    def show_game_over(self):
        """Display game over screen"""
        os.system('clear' if os.name == 'posix' else 'cls')
        print(colored("*" * 60, 'red'))
        print(colored("*" + "GAME OVER".center(58) + "*", 'red'))
        print(colored("*" * 60, 'red'))
        
        print(colored(f"\nFinal Score: {self.score}", 'cyan'))
        print(colored(f"Countries guessed correctly: {self.rounds_played - 1}", 'cyan'))
        
        print(colored("\n1. Play Again", 'yellow'))
        print(colored("2. Main Menu", 'yellow'))
        print(colored("3. Exit Game", 'yellow'))
        
        while True:
            try:
                choice = int(input(colored("Enter your choice: ", 'yellow')))
                if choice == 1:
                    self.game_over = False
                    self.score = 0
                    self.rounds_played = 0
                    self.total_time = 0
                    return
                elif choice == 2:
                    self.game_over = False
                    self.score = 0
                    self.rounds_played = 0
                    self.total_time = 0
                    return "main_menu"
                elif choice == 3:
                    return "exit"
                else:
                    print(colored(self.lang_data["invalid_choice"], 'red'))
            except ValueError:
                print(colored(self.lang_data["invalid_input"], 'red'))
        
    def show_score(self):
        """Display the current score"""
        print(colored("\n" + "=" * 40, 'yellow'))
        print(colored(self.lang_data["score_summary"], 'cyan'))
        print(colored(f"{self.lang_data['total_score']}: {self.score}", 'green'))
        print(colored(f"{self.lang_data['rounds_played']}: {self.rounds_played}", 'green'))
        
        if self.rounds_played > 0:
            avg_time = self.total_time / self.rounds_played
            print(colored(f"{self.lang_data['avg_time']}: {avg_time:.2f} {self.lang_data['seconds']}", 'green'))
            
        print(colored("=" * 40, 'yellow'))
        
    def select_language(self):
        """Allow user to select a language"""
        print(colored(self.lang_data["select_language"], 'cyan'))
        for i, lang in enumerate(LANGUAGES.keys(), 1):
            print(f"{i}. {lang.capitalize()}")
            
        while True:
            try:
                choice = int(input(colored(self.lang_data["language_choice"], 'yellow')))
                if 1 <= choice <= len(LANGUAGES):
                    lang_code = list(LANGUAGES.values())[choice-1]
                    self.language = lang_code
                    self.lang_data = load_language_data(lang_code)
                    break
                else:
                    print(colored(self.lang_data["invalid_choice"], 'red'))
            except ValueError:
                print(colored(self.lang_data["invalid_input"], 'red'))
                
    def main_menu(self):
        """Display the main menu"""
        while True:
            self.display_title()
            print(colored(self.lang_data["main_menu"], 'cyan'))
            print(f"1. {self.lang_data['play_game']}")
            print(f"2. {self.lang_data['change_language']}")
            print(f"3. {self.lang_data['view_score']}")
            print(f"4. {self.lang_data['exit_game']}")
            
            try:
                choice = int(input(colored(self.lang_data["menu_choice"], 'yellow')))
                if choice == 1:
                    while not self.game_over:
                        self.play_round()
                    result = self.show_game_over()
                    if result == "exit":
                        break
                elif choice == 2:
                    self.select_language()
                elif choice == 3:
                    self.show_score()
                    input(colored(self.lang_data["continue_prompt"], 'yellow'))
                elif choice == 4:
                    print(colored(self.lang_data["goodbye_message"], 'green'))
                    break
                else:
                    print(colored(self.lang_data["invalid_choice"], 'red'))
            except ValueError:
                print(colored(self.lang_data["invalid_input"], 'red'))

if __name__ == "__main__":
    game = CountryPuzzleGame()
    game.main_menu()

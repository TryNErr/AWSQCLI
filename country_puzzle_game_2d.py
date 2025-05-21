#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pygame
import sys
import random
import time
import json
import os
import math
from pygame.locals import *

# Initialize pygame
pygame.init()
pygame.font.init()

# Constants
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 768
FPS = 60
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (200, 200, 200)
LIGHT_BLUE = (173, 216, 230)
DARK_BLUE = (0, 0, 139)
GREEN = (0, 128, 0)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)
PURPLE = (128, 0, 128)

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
        print("Country data file not found.")
        sys.exit(1)

# Load flag images
def load_flag_images(countries):
    flag_images = {}
    for country_key in countries:
        try:
            flag_path = f"flags/{country_key}.png"
            if os.path.exists(flag_path):
                flag_images[country_key] = pygame.image.load(flag_path)
            else:
                # Create a placeholder flag if image doesn't exist
                flag_surface = pygame.Surface((120, 80))
                flag_surface.fill(LIGHT_BLUE)
                pygame.draw.rect(flag_surface, BLACK, (0, 0, 120, 80), 2)
                font = pygame.font.SysFont('Arial', 14)
                text = font.render(countries[country_key]["names"]["en"], True, BLACK)
                flag_surface.blit(text, (10, 30))
                flag_images[country_key] = flag_surface
        except Exception as e:
            print(f"Error loading flag for {country_key}: {e}")
            flag_surface = pygame.Surface((120, 80))
            flag_surface.fill(LIGHT_BLUE)
            flag_images[country_key] = flag_surface
    return flag_images

# Button class
class Button:
    def __init__(self, x, y, width, height, text, color, hover_color, text_color=BLACK, font_size=24):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.color = color
        self.hover_color = hover_color
        self.text_color = text_color
        self.font = pygame.font.SysFont('Arial', font_size)
        self.is_hovered = False
        
    def draw(self, surface):
        color = self.hover_color if self.is_hovered else self.color
        pygame.draw.rect(surface, color, self.rect)
        pygame.draw.rect(surface, BLACK, self.rect, 2)  # Border
        
        text_surface = self.font.render(self.text, True, self.text_color)
        text_rect = text_surface.get_rect(center=self.rect.center)
        surface.blit(text_surface, text_rect)
        
    def check_hover(self, pos):
        self.is_hovered = self.rect.collidepoint(pos)
        return self.is_hovered
        
    def is_clicked(self, pos, event):
        if event.type == MOUSEBUTTONDOWN and event.button == 1:
            return self.rect.collidepoint(pos)
        return False

# Country option button class (extends Button)
class CountryButton(Button):
    def __init__(self, x, y, width, height, text, country_key, flag_image, color, hover_color):
        super().__init__(x, y, width, height, text, color, hover_color)
        self.country_key = country_key
        self.flag_image = flag_image
        
    def draw(self, surface):
        super().draw(surface)
        
        # Draw flag image
        if self.flag_image:
            flag_rect = self.flag_image.get_rect()
            flag_rect.width = min(flag_rect.width, self.rect.width - 20)
            flag_rect.height = min(flag_rect.height, self.rect.height - 60)
            scaled_flag = pygame.transform.scale(self.flag_image, (flag_rect.width, flag_rect.height))
            
            flag_x = self.rect.x + (self.rect.width - flag_rect.width) // 2
            flag_y = self.rect.y + 10
            surface.blit(scaled_flag, (flag_x, flag_y))
            
            # Draw country name below flag
            text_surface = self.font.render(self.text, True, self.text_color)
            text_rect = text_surface.get_rect(center=(self.rect.centerx, self.rect.bottom - 20))
            surface.blit(text_surface, text_rect)

# Game class
class CountryPuzzleGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Country Puzzle Game")
        self.clock = pygame.time.Clock()
        self.language = "en"
        self.lang_data = load_language_data(self.language)
        self.countries = load_countries()
        self.flag_images = load_flag_images(self.countries)
        self.score = 0
        self.total_time = 0
        self.rounds_played = 0
        self.state = "main_menu"
        self.buttons = []
        self.country_buttons = []
        self.selected_countries = []
        self.correct_country = ""
        self.current_hint_index = 0
        self.start_time = 0
        self.result_message = ""
        self.points_earned = 0
        self.time_taken = 0
        self.tries_remaining = 3  # Maximum 3 tries per country
        self.game_over = False    # Flag to indicate if game is over
        
        # Fonts
        self.title_font = pygame.font.SysFont('Arial', 48, bold=True)
        self.heading_font = pygame.font.SysFont('Arial', 36, bold=True)
        self.normal_font = pygame.font.SysFont('Arial', 24)
        self.hint_font = pygame.font.SysFont('Arial', 28)
        
        # Background
        self.bg_color = LIGHT_BLUE
        
        # Create main menu buttons
        self.create_main_menu_buttons()
        
    def create_main_menu_buttons(self):
        self.buttons = []
        button_width = 300
        button_height = 60
        start_y = SCREEN_HEIGHT // 2 - 100
        
        # Play button
        self.buttons.append(Button(
            SCREEN_WIDTH // 2 - button_width // 2,
            start_y,
            button_width, button_height,
            self.lang_data["play_game"],
            GRAY, WHITE
        ))
        
        # Language button
        self.buttons.append(Button(
            SCREEN_WIDTH // 2 - button_width // 2,
            start_y + button_height + 20,
            button_width, button_height,
            self.lang_data["change_language"],
            GRAY, WHITE
        ))
        
        # Score button
        self.buttons.append(Button(
            SCREEN_WIDTH // 2 - button_width // 2,
            start_y + (button_height + 20) * 2,
            button_width, button_height,
            self.lang_data["view_score"],
            GRAY, WHITE
        ))
        
        # Exit button
        self.buttons.append(Button(
            SCREEN_WIDTH // 2 - button_width // 2,
            start_y + (button_height + 20) * 3,
            button_width, button_height,
            self.lang_data["exit_game"],
            GRAY, WHITE
        ))
        
    def create_language_buttons(self):
        self.buttons = []
        button_width = 300
        button_height = 60
        start_y = SCREEN_HEIGHT // 2 - 100
        
        # Language buttons
        for i, lang in enumerate(LANGUAGES.keys()):
            self.buttons.append(Button(
                SCREEN_WIDTH // 2 - button_width // 2,
                start_y + (button_height + 20) * i,
                button_width, button_height,
                lang.capitalize(),
                GRAY, WHITE
            ))
            
        # Back button
        self.buttons.append(Button(
            SCREEN_WIDTH // 2 - button_width // 2,
            start_y + (button_height + 20) * len(LANGUAGES),
            button_width, button_height,
            "Back",
            GRAY, WHITE
        ))
        
    def create_country_buttons(self):
        self.country_buttons = []
        button_width = 180
        button_height = 150
        margin = 20
        total_width = button_width * 5 + margin * 4
        start_x = (SCREEN_WIDTH - total_width) // 2
        start_y = SCREEN_HEIGHT - button_height - 50
        
        # Create buttons for each country option
        for i, country_key in enumerate(self.selected_countries):
            country_name = self.countries[country_key]["names"][self.language]
            flag_image = self.flag_images.get(country_key)
            
            self.country_buttons.append(CountryButton(
                start_x + i * (button_width + margin),
                start_y,
                button_width, button_height,
                country_name,
                country_key,
                flag_image,
                GRAY, WHITE
            ))
            
    def select_random_countries(self, count=5):
        """Select random countries for options"""
        available_countries = list(self.countries.keys())
        if len(available_countries) < count:
            count = len(available_countries)
        return random.sample(available_countries, count)
        
    def start_new_round(self):
        if self.game_over:
            self.state = "game_over"
            return
            
        self.selected_countries = self.select_random_countries()
        self.correct_country = random.choice(self.selected_countries)
        self.current_hint_index = 0
        self.start_time = time.time()
        self.result_message = ""
        self.tries_remaining = 3  # Reset tries for new round
        self.create_country_buttons()
        
    def check_guess(self, country_key):
        end_time = time.time()
        self.time_taken = end_time - self.start_time
        
        if country_key == self.correct_country:
            # Calculate points
            max_hints = len(self.countries[self.correct_country]["hints"][self.language])
            hint_factor = (max_hints - self.current_hint_index) / max_hints
            time_factor = max(0, 1 - (self.time_taken / 60))
            self.points_earned = int((hint_factor * 70 + time_factor * 30) * 10)
            
            self.score += self.points_earned
            self.total_time += self.time_taken
            self.rounds_played += 1
            
            self.result_message = self.lang_data["correct_guess"]
            
            # Automatically proceed to next round after a short delay
            pygame.time.set_timer(USEREVENT + 1, 1500)  # 1.5 second delay
        else:
            self.tries_remaining -= 1
            
            if self.tries_remaining > 0:
                # Show next hint if available
                if self.current_hint_index < len(self.countries[self.correct_country]["hints"][self.language]) - 1:
                    self.current_hint_index += 1
                    self.result_message = f"{self.lang_data['wrong_guess']} {self.tries_remaining} tries remaining."
                else:
                    self.result_message = f"Wrong! No more hints. {self.tries_remaining} tries remaining."
            else:
                # Game over after 3 wrong tries
                self.result_message = f"{self.lang_data['wrong_guess']} {self.lang_data['correct_answer']} {self.countries[self.correct_country]['names'][self.language]}."
                self.rounds_played += 1
                self.game_over = True
                
                # Show game over screen after a short delay
                pygame.time.set_timer(USEREVENT + 2, 2000)  # 2 second delay
        
    def draw_main_menu(self):
        # Draw title
        title_text = self.title_font.render(self.lang_data["game_title"], True, DARK_BLUE)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 150))
        self.screen.blit(title_text, title_rect)
        
        # Draw welcome message
        welcome_text = self.normal_font.render(self.lang_data["welcome_message"], True, BLACK)
        welcome_rect = welcome_text.get_rect(center=(SCREEN_WIDTH // 2, 220))
        self.screen.blit(welcome_text, welcome_rect)
        
        # Draw buttons
        for button in self.buttons:
            button.draw(self.screen)
            
    def draw_language_menu(self):
        # Draw title
        title_text = self.heading_font.render(self.lang_data["select_language"], True, DARK_BLUE)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 150))
        self.screen.blit(title_text, title_rect)
        
        # Draw buttons
        for button in self.buttons:
            button.draw(self.screen)
            
    def draw_score_screen(self):
        # Draw title
        title_text = self.heading_font.render(self.lang_data["score_summary"], True, DARK_BLUE)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 150))
        self.screen.blit(title_text, title_rect)
        
        # Draw score info
        y_pos = 250
        line_height = 40
        
        score_text = self.normal_font.render(f"{self.lang_data['total_score']}: {self.score}", True, BLACK)
        self.screen.blit(score_text, (SCREEN_WIDTH // 2 - score_text.get_width() // 2, y_pos))
        y_pos += line_height
        
        rounds_text = self.normal_font.render(f"{self.lang_data['rounds_played']}: {self.rounds_played}", True, BLACK)
        self.screen.blit(rounds_text, (SCREEN_WIDTH // 2 - rounds_text.get_width() // 2, y_pos))
        y_pos += line_height
        
        if self.rounds_played > 0:
            avg_time = self.total_time / self.rounds_played
            time_text = self.normal_font.render(f"{self.lang_data['avg_time']}: {avg_time:.2f} {self.lang_data['seconds']}", True, BLACK)
            self.screen.blit(time_text, (SCREEN_WIDTH // 2 - time_text.get_width() // 2, y_pos))
        
        # Back button
        if not self.buttons:
            back_button = Button(
                SCREEN_WIDTH // 2 - 150,
                SCREEN_HEIGHT - 150,
                300, 60,
                "Back",
                GRAY, WHITE
            )
            self.buttons = [back_button]
        
        for button in self.buttons:
            button.draw(self.screen)
            
    def draw_game_screen(self):
        # Draw round title
        title_text = self.heading_font.render(self.lang_data["new_round"], True, DARK_BLUE)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 50))
        self.screen.blit(title_text, title_rect)
        
        # Draw instructions
        instr_text = self.normal_font.render(self.lang_data["instructions"], True, BLACK)
        instr_rect = instr_text.get_rect(center=(SCREEN_WIDTH // 2, 100))
        self.screen.blit(instr_text, instr_rect)
        
        # Draw tries remaining
        tries_text = self.normal_font.render(f"Tries remaining: {self.tries_remaining}", True, RED if self.tries_remaining == 1 else BLACK)
        tries_rect = tries_text.get_rect(center=(SCREEN_WIDTH // 2, 140))
        self.screen.blit(tries_text, tries_rect)
        
        # Draw current hint
        if self.current_hint_index < len(self.countries[self.correct_country]["hints"][self.language]):
            hint = self.countries[self.correct_country]["hints"][self.language][self.current_hint_index]
            hint_label = self.normal_font.render(f"{self.lang_data['hint']} {self.current_hint_index + 1}/{len(self.countries[self.correct_country]['hints'][self.language])}", True, GREEN)
            self.screen.blit(hint_label, (50, 180))
            
            # Wrap hint text
            words = hint.split(' ')
            lines = []
            line = ""
            for word in words:
                test_line = line + word + " "
                test_width = self.hint_font.size(test_line)[0]
                if test_width < SCREEN_WIDTH - 100:
                    line = test_line
                else:
                    lines.append(line)
                    line = word + " "
            lines.append(line)
            
            # Draw hint text
            for i, line in enumerate(lines):
                hint_text = self.hint_font.render(line, True, BLACK)
                self.screen.blit(hint_text, (50, 220 + i * 40))
                
        # Draw result message if there is one
        if self.result_message:
            result_text = self.heading_font.render(self.result_message, True, GREEN if "Correct" in self.result_message else RED)
            result_rect = result_text.get_rect(center=(SCREEN_WIDTH // 2, 350))
            self.screen.blit(result_text, result_rect)
            
            if "Correct" in self.result_message:
                points_text = self.normal_font.render(f"{self.lang_data['points_earned']}: {self.points_earned}", True, BLACK)
                points_rect = points_text.get_rect(center=(SCREEN_WIDTH // 2, 400))
                self.screen.blit(points_text, points_rect)
                
                time_text = self.normal_font.render(f"{self.lang_data['time_taken']}: {self.time_taken:.2f} {self.lang_data['seconds']}", True, BLACK)
                time_rect = time_text.get_rect(center=(SCREEN_WIDTH // 2, 440))
                self.screen.blit(time_text, time_rect)
                
                # Show "Next country in X seconds" message
                next_text = self.normal_font.render("Next country in 1.5 seconds...", True, PURPLE)
                next_rect = next_text.get_rect(center=(SCREEN_WIDTH // 2, 480))
                self.screen.blit(next_text, next_rect)
                
        # Draw country options
        for button in self.country_buttons:
            button.draw(self.screen)
            
    def draw_game_over_screen(self):
        # Draw game over title
        title_text = self.title_font.render("GAME OVER", True, RED)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 150))
        self.screen.blit(title_text, title_rect)
        
        # Draw final score
        score_text = self.heading_font.render(f"Final Score: {self.score}", True, DARK_BLUE)
        score_rect = score_text.get_rect(center=(SCREEN_WIDTH // 2, 250))
        self.screen.blit(score_text, score_rect)
        
        # Draw rounds played
        rounds_text = self.normal_font.render(f"Countries guessed correctly: {self.rounds_played - 1}", True, BLACK)
        rounds_rect = rounds_text.get_rect(center=(SCREEN_WIDTH // 2, 320))
        self.screen.blit(rounds_text, rounds_rect)
        
        # Draw play again button
        play_again_button = Button(
            SCREEN_WIDTH // 2 - 150,
            400,
            300, 60,
            "Play Again",
            GRAY, WHITE
        )
        play_again_button.draw(self.screen)
        self.play_again_button = play_again_button
        
        # Draw main menu button
        main_menu_button = Button(
            SCREEN_WIDTH // 2 - 150,
            480,
            300, 60,
            "Main Menu",
            GRAY, WHITE
        )
        main_menu_button.draw(self.screen)
        self.main_menu_button = main_menu_button
            
    def run(self):
        running = True
        
        while running:
            mouse_pos = pygame.mouse.get_pos()
            
            # Handle events
            for event in pygame.event.get():
                if event.type == QUIT:
                    running = False
                    
                # Handle custom events for timers
                if event.type == USEREVENT + 1:  # Timer for next country after correct guess
                    pygame.time.set_timer(USEREVENT + 1, 0)  # Stop the timer
                    self.start_new_round()
                    
                if event.type == USEREVENT + 2:  # Timer for game over after 3 wrong tries
                    pygame.time.set_timer(USEREVENT + 2, 0)  # Stop the timer
                    self.state = "game_over"
                    
                # Handle mouse clicks
                if event.type == MOUSEBUTTONDOWN:
                    if self.state == "main_menu":
                        for i, button in enumerate(self.buttons):
                            if button.is_clicked(mouse_pos, event):
                                if i == 0:  # Play Game
                                    self.state = "game"
                                    self.game_over = False
                                    self.score = 0
                                    self.rounds_played = 0
                                    self.total_time = 0
                                    self.start_new_round()
                                elif i == 1:  # Change Language
                                    self.state = "language_menu"
                                    self.create_language_buttons()
                                elif i == 2:  # View Score
                                    self.state = "score"
                                    self.buttons = []  # Will create back button in draw method
                                elif i == 3:  # Exit Game
                                    running = False
                                    
                    elif self.state == "language_menu":
                        for i, button in enumerate(self.buttons):
                            if button.is_clicked(mouse_pos, event):
                                if i < len(LANGUAGES):  # Language selection
                                    self.language = list(LANGUAGES.values())[i]
                                    self.lang_data = load_language_data(self.language)
                                    self.create_main_menu_buttons()
                                    self.state = "main_menu"
                                else:  # Back button
                                    self.state = "main_menu"
                                    self.create_main_menu_buttons()
                                    
                    elif self.state == "score":
                        for button in self.buttons:
                            if button.is_clicked(mouse_pos, event):
                                self.state = "main_menu"
                                self.create_main_menu_buttons()
                                
                    elif self.state == "game":
                        # Check country button clicks if no result message is showing
                        if not self.result_message:
                            for button in self.country_buttons:
                                if button.is_clicked(mouse_pos, event):
                                    self.check_guess(button.country_key)
                                    
                    elif self.state == "game_over":
                        if hasattr(self, 'play_again_button') and self.play_again_button.is_clicked(mouse_pos, event):
                            self.state = "game"
                            self.game_over = False
                            self.score = 0
                            self.rounds_played = 0
                            self.total_time = 0
                            self.start_new_round()
                        elif hasattr(self, 'main_menu_button') and self.main_menu_button.is_clicked(mouse_pos, event):
                            self.state = "main_menu"
                            self.create_main_menu_buttons()
            
            # Update button hover states
            if self.state in ["main_menu", "language_menu", "score"]:
                for button in self.buttons:
                    button.check_hover(mouse_pos)
            elif self.state == "game":
                for button in self.country_buttons:
                    button.check_hover(mouse_pos)
            elif self.state == "game_over":
                if hasattr(self, 'play_again_button'):
                    self.play_again_button.check_hover(mouse_pos)
                if hasattr(self, 'main_menu_button'):
                    self.main_menu_button.check_hover(mouse_pos)
            
            # Draw everything
            self.screen.fill(self.bg_color)
            
            if self.state == "main_menu":
                self.draw_main_menu()
            elif self.state == "language_menu":
                self.draw_language_menu()
            elif self.state == "score":
                self.draw_score_screen()
            elif self.state == "game":
                self.draw_game_screen()
            elif self.state == "game_over":
                self.draw_game_over_screen()
                
            pygame.display.flip()
            self.clock.tick(FPS)
            
        pygame.quit()
        sys.exit()

# Create flags directory if it doesn't exist
if not os.path.exists("flags"):
    os.makedirs("flags")

# Run the game
if __name__ == "__main__":
    game = CountryPuzzleGame()
    game.run()

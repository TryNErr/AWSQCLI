import pygame
import sys
import math
import random
from pygame.locals import *

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
FPS = 60
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)

# Game window
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Boomerang Dodge")
clock = pygame.time.Clock()

# Load images and scale them
def load_image(path, scale=1.0):
    try:
        img = pygame.image.load(path).convert_alpha()
        width = int(img.get_width() * scale)
        height = int(img.get_height() * scale)
        return pygame.transform.scale(img, (width, height))
    except pygame.error:
        # If image loading fails, create a placeholder
        surf = pygame.Surface((50, 50), pygame.SRCALPHA)
        pygame.draw.circle(surf, RED, (25, 25), 25)
        return surf

# Player class
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Create a placeholder for the player
        self.image = pygame.Surface((40, 80), pygame.SRCALPHA)
        pygame.draw.rect(self.image, BLUE, (0, 0, 40, 80))
        self.rect = self.image.get_rect(midbottom=(WIDTH // 2, HEIGHT - 20))
        self.speed = 5
        self.is_jumping = False
        self.jump_velocity = 0
        self.gravity = 0.5

    def update(self):
        keys = pygame.key.get_pressed()
        
        # Horizontal movement
        if keys[K_LEFT] and self.rect.left > 0:
            self.rect.x -= self.speed
        if keys[K_RIGHT] and self.rect.right < WIDTH:
            self.rect.x += self.speed
            
        # Jumping
        if keys[K_SPACE] and not self.is_jumping:
            self.is_jumping = True
            self.jump_velocity = -12
            
        if self.is_jumping:
            self.rect.y += self.jump_velocity
            self.jump_velocity += self.gravity
            
            if self.rect.bottom >= HEIGHT - 20:
                self.rect.bottom = HEIGHT - 20
                self.is_jumping = False

# Boomerang class
class Boomerang(pygame.sprite.Sprite):
    def __init__(self, start_pos, target_pos):
        super().__init__()
        # Create a placeholder for the boomerang
        self.image = pygame.Surface((30, 30), pygame.SRCALPHA)
        pygame.draw.polygon(self.image, YELLOW, [(0, 0), (30, 15), (0, 30), (15, 15)])
        
        self.rect = self.image.get_rect(center=start_pos)
        self.pos = pygame.math.Vector2(start_pos)
        self.vel = pygame.math.Vector2(0, 0)
        self.acc = pygame.math.Vector2(0, 0)
        
        # Calculate direction to target
        self.direction = pygame.math.Vector2(target_pos) - self.pos
        self.direction.normalize_ip()
        
        # Set initial velocity
        self.speed = 5
        self.vel = self.direction * self.speed
        
        # Boomerang properties
        self.max_distance = 300  # Maximum distance before returning
        self.start_pos = pygame.math.Vector2(start_pos)
        self.returning = False
        self.angle = 0
        self.rotation_speed = 10
        self.original_image = self.image.copy()

    def update(self):
        # Rotate the boomerang
        self.angle = (self.angle + self.rotation_speed) % 360
        self.image = pygame.transform.rotate(self.original_image, self.angle)
        self.rect = self.image.get_rect(center=self.rect.center)
        
        # Move the boomerang
        if not self.returning and self.pos.distance_to(self.start_pos) > self.max_distance:
            self.returning = True
            
        if self.returning:
            # Calculate direction back to player
            direction = pygame.math.Vector2(WIDTH // 2, HEIGHT - 60) - self.pos
            if direction.length() > 0:
                direction.normalize_ip()
                self.vel = direction * self.speed
        
        self.pos += self.vel
        self.rect.center = (int(self.pos.x), int(self.pos.y))
        
        # Remove if it goes off screen
        if self.rect.right < 0 or self.rect.left > WIDTH or self.rect.bottom < 0 or self.rect.top > HEIGHT:
            self.kill()

# Game class
class Game:
    def __init__(self):
        self.all_sprites = pygame.sprite.Group()
        self.boomerangs = pygame.sprite.Group()
        self.player = Player()
        self.all_sprites.add(self.player)
        
        self.level = 1
        self.score = 0
        self.game_over = False
        self.font = pygame.font.SysFont(None, 36)
        
        # Level properties
        self.boomerang_count = 1
        self.spawn_timer = 0
        self.spawn_delay = 2000  # milliseconds
        
    def spawn_boomerangs(self):
        current_time = pygame.time.get_ticks()
        
        if current_time - self.spawn_timer > self.spawn_delay and len(self.boomerangs) < self.boomerang_count:
            # Spawn from random edge position
            side = random.choice(['left', 'right', 'top'])
            
            if side == 'left':
                pos = (0, random.randint(50, HEIGHT - 100))
            elif side == 'right':
                pos = (WIDTH, random.randint(50, HEIGHT - 100))
            else:  # top
                pos = (random.randint(50, WIDTH - 50), 0)
                
            # Target is slightly offset from player to create curved path
            target_pos = (self.player.rect.centerx + random.randint(-100, 100), 
                          self.player.rect.centery + random.randint(-50, 50))
            
            boomerang = Boomerang(pos, target_pos)
            self.boomerangs.add(boomerang)
            self.all_sprites.add(boomerang)
            self.spawn_timer = current_time
    
    def check_collisions(self):
        hits = pygame.sprite.spritecollide(self.player, self.boomerangs, False)
        if hits:
            self.game_over = True
    
    def next_level(self):
        self.level += 1
        self.boomerang_count += 1
        self.spawn_delay = max(500, self.spawn_delay - 200)  # Make boomerangs spawn faster
        
        # Clear all boomerangs
        for boomerang in self.boomerangs:
            boomerang.kill()
            
        # Display level message
        self.show_level_message()
    
    def show_level_message(self):
        screen.fill(BLACK)
        level_text = self.font.render(f"Level {self.level}", True, WHITE)
        level_rect = level_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
        screen.blit(level_text, level_rect)
        
        instruction = self.font.render(f"Dodge {self.boomerang_count} boomerangs!", True, WHITE)
        instruction_rect = instruction.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 50))
        screen.blit(instruction, instruction_rect)
        
        pygame.display.flip()
        pygame.time.delay(2000)  # Show for 2 seconds
    
    def draw_ui(self):
        # Draw score and level
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        level_text = self.font.render(f"Level: {self.level}", True, WHITE)
        boomerang_text = self.font.render(f"Boomerangs: {self.boomerang_count}", True, WHITE)
        
        screen.blit(score_text, (10, 10))
        screen.blit(level_text, (10, 50))
        screen.blit(boomerang_text, (10, 90))
    
    def game_over_screen(self):
        screen.fill(BLACK)
        game_over_text = self.font.render("GAME OVER", True, RED)
        score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
        level_text = self.font.render(f"You reached Level {self.level}", True, WHITE)
        restart_text = self.font.render("Press R to restart or Q to quit", True, WHITE)
        
        screen.blit(game_over_text, (WIDTH // 2 - game_over_text.get_width() // 2, HEIGHT // 2 - 60))
        screen.blit(score_text, (WIDTH // 2 - score_text.get_width() // 2, HEIGHT // 2))
        screen.blit(level_text, (WIDTH // 2 - level_text.get_width() // 2, HEIGHT // 2 + 40))
        screen.blit(restart_text, (WIDTH // 2 - restart_text.get_width() // 2, HEIGHT // 2 + 100))
        
        pygame.display.flip()
        
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == KEYDOWN:
                    if event.key == K_r:
                        self.__init__()  # Reset the game
                        self.show_level_message()
                        waiting = False
                    elif event.key == K_q:
                        pygame.quit()
                        sys.exit()
    
    def run(self):
        self.show_level_message()
        
        # Main game loop
        running = True
        while running:
            clock.tick(FPS)
            
            # Process events
            for event in pygame.event.get():
                if event.type == QUIT:
                    running = False
                    
            if not self.game_over:
                # Update
                self.all_sprites.update()
                self.spawn_boomerangs()
                self.check_collisions()
                
                # Check if all boomerangs for this level have been dodged
                if len(self.boomerangs) == 0 and pygame.time.get_ticks() - self.spawn_timer > 3000:
                    self.score += self.level * 100
                    self.next_level()
                
                # Draw
                screen.fill(BLACK)
                self.all_sprites.draw(screen)
                self.draw_ui()
            else:
                self.game_over_screen()
                
            pygame.display.flip()
            
        pygame.quit()

# Start the game
if __name__ == "__main__":
    game = Game()
    game.run()

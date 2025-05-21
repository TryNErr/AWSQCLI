#!/usr/bin/env python3
"""
A simple command-line Tic Tac Toe game for two players.
Players take turns entering their moves by specifying row and column coordinates.
"""

def print_board(board):
    """Print the current state of the game board."""
    print("\n")
    for i, row in enumerate(board):
        print(" | ".join(cell if cell else " " for cell in row))
        if i < 2:  # Don't print separator after the last row
            print("-" * 9)
    print("\n")

def check_winner(board, player):
    """Check if the specified player has won."""
    # Check rows
    for row in board:
        if all(cell == player for cell in row):
            return True
    
    # Check columns
    for col in range(3):
        if all(board[row][col] == player for row in range(3)):
            return True
    
    # Check diagonals
    if all(board[i][i] == player for i in range(3)) or all(board[i][2-i] == player for i in range(3)):
        return True
    
    return False

def is_board_full(board):
    """Check if the board is full (tie game)."""
    return all(all(cell for cell in row) for row in board)

def main():
    """Main game function."""
    # Initialize empty 3x3 board
    board = [['' for _ in range(3)] for _ in range(3)]
    current_player = 'X'
    
    print("Welcome to Tic Tac Toe!")
    print("Players take turns entering moves as row,column coordinates (0-2).")
    print("For example, the top-left corner is '0,0' and the bottom-right is '2,2'.")
    
    while True:
        print_board(board)
        print(f"Player {current_player}'s turn")
        
        # Get player move
        while True:
            try:
                move = input("Enter your move (row,col): ")
                row, col = map(int, move.split(','))
                
                # Validate move
                if not (0 <= row <= 2 and 0 <= col <= 2):
                    print("Invalid coordinates! Row and column must be between 0 and 2.")
                    continue
                
                if board[row][col]:
                    print("That position is already taken! Try again.")
                    continue
                
                break
            except (ValueError, IndexError):
                print("Invalid input! Please enter coordinates as 'row,col' (e.g., '1,2').")
        
        # Make move
        board[row][col] = current_player
        
        # Check for win
        if check_winner(board, current_player):
            print_board(board)
            print(f"Player {current_player} wins!")
            break
        
        # Check for tie
        if is_board_full(board):
            print_board(board)
            print("It's a tie!")
            break
        
        # Switch players
        current_player = 'O' if current_player == 'X' else 'X'
    
    play_again = input("Would you like to play again? (y/n): ")
    if play_again.lower() == 'y':
        main()
    else:
        print("Thanks for playing!")

if __name__ == "__main__":
    main()

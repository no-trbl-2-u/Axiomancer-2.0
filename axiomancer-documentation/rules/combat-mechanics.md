# Combat Mechanics
Heart > Body > Mind > Heart

Combat is Rock-Paper-Scissors meets Dungeons and Dragons

**Important Stat Clarification**:
- **Decision Stats (Body/Mind/Heart)**: Used for combat rolls and determining attack/defense types
- **Skill Stats (physicalSkill/mentalSkill/heartSkill)**: Used ONLY when activating fallacy skills (not in base combat)

- Attack vs. Attack Results:
    - Attack Rolls
        - Determine Advantage:
            - Player with Advantage: rolls 2d20 and takes the higher roll (+ decision stat)
            - With no Advantage: roll 1d20 (+ decision stat)
        - Player and enemy roll simultaneously
        - Winner rolls for damage
            - Example of Attack Rolls: 
                - Player picks Body Attack
                - Enemy picks Mind Attack
                - Player rolls 2d20 (takes the higher roll) then adds their decision stat
                - Enemy rolls 1d20 and then adds their decision stat
                - Whoever has the higher roll result then rolls for damage
    - Damage roll
        - If player has advantage:
            - 2d20 (take the higher roll) + Type Decision stat vs. Enemy's matching type defense
            - Example:
                - Attacking Player chose Body, so {Damage} - Physical Defense
                - Enemy has 10 Physical Defense
                - Player rolls an 8 and a 14
                - The 14 is kept, now add Type Decision (in this example, let's say 5)
                - Player has 19 Damage coming the Enemy's way
                - 19 Damage minus 10 means the player did 9 damage
        - If attacking player does not have advantage, but still wins the attack roll
            - Same thing, except 1d20 + Type Decision Stat
            - Example:
                - Enemy has 10 Physical Defense
                - Player rolls a 2 for damage
                - 2 + Type Decision Stat (in this example, let's say 5)
                - Player has 7 Damage coming the enemy's way
                - 7 - 10 = -3 (all negative numbers are rounded to 0)
                - Player did 0 damage
        - If player has disadvantage, but still wins the combat roll
            - Same thing, except 2d20 + Type decision stat and take the worst results
            - Example:
                - Enemy has 10 Physical Defense
                - Player rolls 2d20 (20 and 15 and so the 15 is used)
                - 15 + Type Decision Stat (in this example, let's say 5)
                - Player has 20 damage coming the enemy's way
                - 20 - 10 = 10
                - Attacking Player did 10 damage

- Attack (player) vs. Defense (Enemy) Results Examples
    - All attack rolls for attacking player vs. defense automatically hit
    - Defender gets x1.5 to all their defense stats
    - Attacker with Disadvantage
        - Player chooses Body Attack
        - Enemy chooses Heart Defense
        - Advantage is determined
        - Enemy has advantage
            - Causes player to roll 2d20 and take the worse result
            - Causes defender to use their selected type decision defense
        - Player rolls 2d20 (16 and a 12, the 12 is chosen)
        - 12 + Body stat (in this case 5)
        - Player has 17 attack coming to the enemy
        - Enemy has 20 Heart Defense (Defending player uses their Type Decision defense stat)
        - (17 - 20) = -3 (rounded to 0)
        - Player deals 0 damage
    - Attacker with Advantage
        - Player Chooses Body Attack
        - Enemy Chooses Mind Defense
        - Advantage is determined
        - Player has advantage
            - Player rolls 2d20 and keeps higher result
            - Defending player uses Attacker's Type decision for defense
        - Player rolls 2d20 (7 and a 12, the 12 is chosen)
        - 12 + Body stat (in this case 5)
        - Player has 17 damage coming their way
        - Enemy defended using heart, but since player has advantage, their physical defense is used instead
        - Enemy has 20 heartDefense and 10 physicalDefense
        - (17 - 10) = 7
        - Player deals 7 damage
    - Attacker is Neutral
        - Player Chooses Body Attack
        - Enemy Chooses Body Defense
        - Neutral Effect:
            - Enemy's defense is x1.5
        - Player Rolls for damage, 1d20 (7)
        - Enemy has 6(*1.5) Physical Defense, so 9
        - 7 - 9 = -2 (rounded up to 0)
        - Player does 0 damage
    - Same rules are applied flipped

- Defense vs. Defense Results
    - Increment the "Friendly Counter"
    - If the friendly counter reaches 3:
        - Change the modal from a Combat modal to a "New Friends" Modal
        - Just render both portaits side to side and a big smiley face in the middle and a "Continue" button underneath
                                          
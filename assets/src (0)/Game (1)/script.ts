/**
 * this game is a multiplayer FPS game with only one weapon : instantgib gun
 * you can use your grappling hook to cross the map at high speed
 * game modes intended are :
 * - deathmatch
 * - team deathmatch
 * - capture the flag
 * - hyper ball
 * Since the game is simple with only one weapon and a grappling hook,
 * we want to avoid creating tons of actor that get destroyed almost instandly
 * therefore each player as one wire and one trail attached to it
 */

let Game = {
    
    // input manager allow us to specify the inputs of the game for the user
    inputManager : new InputManager("AZERTY"),
    world : new World(),
};


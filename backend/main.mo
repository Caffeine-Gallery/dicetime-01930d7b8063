import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

actor {
    // Stable variables for persistence
    stable var currentChallenge : Text = "";
    stable var endTime : Int = 0;
    stable var isActive : Bool = false;

    // Array of possible challenges
    let challenges : [Text] = [
        "Do 20 pushups",
        "Read for 15 minutes",
        "Write a gratitude list",
        "Meditate for 5 minutes",
        "Take a 10-minute walk",
        "Drink a glass of water",
        "Stretch for 5 minutes",
        "Clean your desk",
        "Call a friend",
        "Practice deep breathing"
    ];

    // Generate a random number between 0 and max-1
    private func randomNumber(max: Nat) : async Nat {
        let random = await Random.blob();
        let randomBytes = Blob.toArray(random);
        if (randomBytes.size() == 0) {
            return 0; // fallback value if we can't get random bytes
        };
        let randomByte = randomBytes[0];
        return Nat8.toNat(randomByte) % max;
    };

    // Start a new challenge
    public func startNewChallenge() : async Text {
        let index = await randomNumber(challenges.size());
        currentChallenge := challenges[index];
        endTime := Time.now() + (15 * 60 * 1000_000_000); // 15 minutes in nanoseconds
        isActive := true;
        return currentChallenge;
    };

    // Get current challenge status
    public query func getCurrentChallenge() : async {
        challenge: Text;
        timeRemaining: Int;
        active: Bool;
    } {
        let remaining = if (isActive) { endTime - Time.now() } else { 0 };
        return {
            challenge = currentChallenge;
            timeRemaining = remaining;
            active = isActive;
        };
    };

    // Complete current challenge
    public func completeChallenge() : async Bool {
        if (isActive) {
            isActive := false;
            return true;
        };
        return false;
    };
}

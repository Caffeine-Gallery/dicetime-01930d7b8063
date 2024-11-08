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
import Buffer "mo:base/Buffer";

actor {
    // Stable variables for persistence
    stable var currentChallenge : Text = "";
    stable var endTime : Int = 0;
    stable var isActive : Bool = false;
    stable var completedChallengesEntries : [(Text, Int)] = [];

    private let completedChallenges = Buffer.Buffer<(Text, Int)>(0);

    // Initialize the buffer with stable data
    private func loadStableData() {
        for ((challenge, timestamp) in completedChallengesEntries.vals()) {
            completedChallenges.add((challenge, timestamp));
        };
    };

    loadStableData();

    system func preupgrade() {
        completedChallengesEntries := Buffer.toArray(completedChallenges);
    };

    system func postupgrade() {
        loadStableData();
    };

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

    private func randomNumber(max: Nat) : async Nat {
        let random = await Random.blob();
        let randomBytes = Blob.toArray(random);
        if (randomBytes.size() == 0) {
            return 0;
        };
        let randomByte = randomBytes[0];
        return Nat8.toNat(randomByte) % max;
    };

    public func startNewChallenge() : async Text {
        let index = await randomNumber(challenges.size());
        currentChallenge := challenges[index];
        endTime := Time.now() + (15 * 60 * 1000_000_000);
        isActive := true;
        return currentChallenge;
    };

    public query func getCurrentChallenge() : async {
        challenge: Text;
        timeRemaining: Int;
        active: Bool;
        startTime: Int;
    } {
        let remaining = if (isActive) { endTime - Time.now() } else { 0 };
        return {
            challenge = currentChallenge;
            timeRemaining = remaining;
            active = isActive;
            startTime = endTime - (15 * 60 * 1000_000_000);
        };
    };

    public func completeChallenge() : async Bool {
        if (isActive) {
            isActive := false;
            completedChallenges.add((currentChallenge, Time.now()));
            return true;
        };
        return false;
    };

    public query func getCompletedChallenges() : async [(Text, Int)] {
        return Buffer.toArray(completedChallenges);
    };
}

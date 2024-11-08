import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'completeChallenge' : ActorMethod<[], boolean>,
  'getCompletedChallenges' : ActorMethod<[], Array<[string, bigint]>>,
  'getCurrentChallenge' : ActorMethod<
    [],
    {
      'startTime' : bigint,
      'active' : boolean,
      'challenge' : string,
      'timeRemaining' : bigint,
    }
  >,
  'startNewChallenge' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completeChallenge' : IDL.Func([], [IDL.Bool], []),
    'getCompletedChallenges' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int))],
        ['query'],
      ),
    'getCurrentChallenge' : IDL.Func(
        [],
        [
          IDL.Record({
            'startTime' : IDL.Int,
            'active' : IDL.Bool,
            'challenge' : IDL.Text,
            'timeRemaining' : IDL.Int,
          }),
        ],
        ['query'],
      ),
    'startNewChallenge' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completeChallenge' : IDL.Func([], [IDL.Bool], []),
    'getCurrentChallenge' : IDL.Func(
        [],
        [
          IDL.Record({
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

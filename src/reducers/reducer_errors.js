export default function (state = {}, action) {
  switch (action.type) {
    case '401': {
      return { ...state, error: action.payload.data.message };
    }
    case '429': {
      return { ...state, error: action.payload.data.message };
    }
    default: {
      return state;
    }
  }
}

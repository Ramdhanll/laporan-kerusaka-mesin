const AuthReducer = (state, action) => {
   switch (action.type) {
      case 'LOGIN':
         return {
            ...state,
            userState: action.payload,
         }
      case 'UPDATE':
         return {
            ...state,
            userState: action.payload,
         }
      case 'LOGOUT':
         return {
            ...state,
            userState: null,
         }
      default:
         return { ...state }
   }
}

export default AuthReducer

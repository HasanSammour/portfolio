// Web3Forms access key. Web3Forms documents this as a PUBLIC key that is safe in client-side code.
// The environment variable (if set) wins; otherwise the built-in key is used, so a deploy can never lose it.
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || 'f67dcd5f-542e-4eee-8834-2d1615ea890f'

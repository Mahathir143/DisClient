// Returns initials from string
export const getInitials = string => {
    if (!string) return ''; // Return empty string if the input is undefined or falsy
    
return string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '');
};

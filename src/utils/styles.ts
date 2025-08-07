export const getWordClasses = (newCardAfter = false, newLineAfter = false) => {
  if (newCardAfter) {
    return "inline-block px-1 py-0.5 my-0.5 bg-purple-200 text-purple-800 rounded mr-1 cursor-pointer";
  } else if (newLineAfter) {
    return "inline-block px-1 py-0.5 my-0.5 bg-green-200 text-green-800 rounded mr-1 cursor-pointer";
  } else {
    return "inline-block mr-1 hover:bg-gray-200 px-1 py-0.5 my-0.5 rounded cursor-pointer";
  }
};

const helpers = {
  // Set initial textarea height with textarea scroll height
  setTextareaHeight(textarea) {
    const height = textarea.scrollHeight;
    textarea.style.height = height + "px";
  },

  /**
   * Update textarea height accordingly to number of lines written
   */
  updateTextareaHeight(textarea) {
    textarea.style.height = ""; // Reset textarea height

    // Define variables to calculate updated textarea height
    const textareaStylesheet = getComputedStyle(textarea);
    const textareaLineHeight = Number.parseInt(
      textareaStylesheet.lineHeight.replace("px", "")
    );
    const textareaNumberOfLines = textarea.scrollHeight / textareaLineHeight;

    // Update textarea height with calculated values
    textarea.style.height = textareaNumberOfLines * textareaLineHeight + "px";
  },

  // Validate URL strings
  validateURLString(string) {
    const regexp =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return regexp.test(string);
  },

  validateDataURLString(string) {
    const regexp = /data:image\/\w+;base64,.+/;
    return regexp.test(string);
  },

  // Check for empty field in every input value
  checkForEmptyFields(values) {
    return values.every((value) => value != "");
  },

  // Check for invalid urls in every input value that receives urls
  checkForInvalidURLs(keys, work) {
    return keys.every((key) => {
      if (key.includes("Link")) return helpers.validateURLString(work[key]);
      else if (key == "dataURL")
        return helpers.validateDataURLString(work[key]);
      else return true;
    });
  },
};

export default helpers;

class constents {
  constructor() {}
  static nameField = "name";
  static tagsField = "tags";
  static statusField = "status";
  static categoryField = "category";
  static directoryName = "/uploads/";
  static attributes = ["id", "name"];
  static errorResult = { success: false };
  static successResult = { success: true };
  static petProvideId = "Please provide valid ID.";
  static petCreateSuccess = "Add a new pet successfully.";
  static petFetchNotFound = "Pets information not found.";
  static petFetchSuccess = "Successfully fetched pets information.";
  static petRequiredFields = ["name", "tags", "status", "category"];
  static petProvideInput = `Please update image or update detail of fields (${this.petRequiredFields}).`;
  static petCreatdeInternalServerError =
    "Some error occurred while add the new pet.";
  static petCreateRequiredFields = {
    "Required fields": this.petRequiredFields,
  };
  static petUpdateRequiredFields = {
    "Please provide value to at least one of these": this.petRequiredFields,
  };
}

module.exports = constents;

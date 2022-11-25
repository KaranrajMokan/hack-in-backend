var mongoose = require("mongoose");

var schema = mongoose.Schema;
var InventorySchema = new schema({
	_id: mongoose.Schema.Types.ObjectId,
	item_name: String,
	item_img_url: String
});

module.exports = mongoose.model("Inventory", InventorySchema);

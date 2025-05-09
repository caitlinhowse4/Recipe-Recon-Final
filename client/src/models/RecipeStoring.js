const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: String,
    ingredients: [ { name: String, quantity: Number, unit: String}],
    servings: Number
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;

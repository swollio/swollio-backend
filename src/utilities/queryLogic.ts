import * as constants from './constants'

/**
 * This function takes in an object with all string values, and returns a new object with 
 * values that are recast into types given by the templateTypes parameter. This is meant to 
 * recast the query string arguments into the respective types.
 * 
 * @example 
 *      queryParams = { weight : "420" },
 *      templateTypes = { number : ["weight"] }
 *      recastQuery(queryParams, templateTypes) => { weight : 420 }
 * 
 * @param {constants.LooseType} queryParams An object that is a JSON representation of all query string parameters
 * @param {{ [key: string] : string [] }} templateTypes An object that maps each argument from the query string to a data type
 * 
 * @returns {any} Returns a JSON with the same key-value pairs as queryParams, except with the right data types
 */
function recastQuery (queryParams : constants.LooseType, templateTypes : { [key: string] : string [] }) {
    
    // Getting an array of each type in the templateTypes object
    let typeList = Object.keys(templateTypes);

    // recastQuery will contain the new list of queryParams with the correct data types
    let recastQuery : { [key: string] : any } = {}

    typeList.forEach(type => {

        // Gettings all the arguments for which this type applies
        let args = templateTypes[type];

        args.forEach(arg => {
            
            // Check if the argument is part of the query string
            if (!queryParams[arg])
                return;
            
            // Handling type switches on a case by case basis
            switch(type) {
                case 'number':
                    recastQuery[arg] = Number(queryParams[arg]);
                    break;
                case 'boolean':
                    recastQuery[arg] = queryParams[arg] === 'true' ? true : false;
                case 'string':
                    recastQuery[arg] = queryParams[arg];
            }
        });
    });
}

module.exports = {
    recastAthleteQuery : (queryParams : constants.LooseType) => recastQuery(queryParams, constants.ATHLETE_D_TYPES)
}
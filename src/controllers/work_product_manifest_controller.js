const _console = require('consola');
const WorkProductManifest = require('../models/WorkProductManifest');
const model = 'Work Product Manifest';

exports.addWorkProductManifest = async (req, res) => {
    _console.info(`Creating ${model}`);
    const {lowerBound, upperBound, alpha, workProduct} = req.body;
    let owner = req.params.id;
    await new WorkProductManifest({owner, lowerBound, upperBound, alpha, workProduct});

}
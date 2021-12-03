module.exports = (sequelize, Sequelize) => {
	const File = sequelize.define('file', {
	  type: {
			type: Sequelize.STRING
	  },
	  name: {
			type: Sequelize.STRING
	  },
	  projetId: {
			type: Sequelize.INTEGER
	  },
	  data: {
			type: Sequelize.BLOB('long')
	  }},
	{
		timestamps: false,
	});
	
	return File;
}
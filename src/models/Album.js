module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    coverUrl: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[
          'CC0', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'CC-BY-ND',
          'CC-BY-NC-SA', 'CC-BY-NC-ND'
        ]]
      }
    },
    licenseUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    }
  }, {
    timestamps: true,
  });

  return Album;
};
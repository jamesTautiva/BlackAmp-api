module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    explicit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[
          'CC0', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC',
          'CC-BY-ND', 'CC-BY-NC-SA', 'CC-BY-NC-ND'
        ]]
      }
    },
    licenseUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Albums',
        key: 'id'
      }
    },
  }, {
    timestamps: true
  });

  return Song;
};

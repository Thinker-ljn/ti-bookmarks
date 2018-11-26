module.exports = `
  CREATE TABLE IF NOT EXISTS spaced_repetition (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL DEFAULT 'default',
  reviewed int(10) NOT NULL DEFAULT 0,
  model_type varchar(255) NOT NULL,
  model_id int(11) NOT NULL,
  execute_time timestamp NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8
`

module.exports = `
  CREATE TABLE IF NOT EXISTS bookmarks (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  url varchar(255) DEFAULT NULL,
  tag int(11) NOT NULL DEFAULT 0,
  updated_at timestamp NULL DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY bookmark_name_unique (name)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8
`
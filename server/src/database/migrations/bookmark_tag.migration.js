module.exports = `
  CREATE TABLE IF NOT EXISTS bookmark_tag (
  bookmark_id int(11) NOT NULL,
  tag_id int(11) NOT NULL,
  PRIMARY KEY (bookmark_id, tag_id)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8
`
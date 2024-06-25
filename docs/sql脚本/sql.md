```sql

-- mysql 新增字段
-- ALTER TABLE 表名 ADD COLUMN 字段名 字段类型;
-- 例如，如果要在名为 users 的表中新增一个名为 age 的字段，类型为整数，
-- ALTER TABLE users ADD COLUMN age INT;
-- mysql  删除字段
-- ALTER TABLE 表名 DROP COLUMN 列名;


--  修改列属性
-- ALTER TABLE 表名 MODIFY 列名 新属性类型;
-- 例如，将表名为table1的列名为column1的列的属性类型从INT修改为VARCHAR(50)：
-- ALTER TABLE table1 MODIFY column1 VARCHAR(50); 

-- 修改列名
-- ALTER TABLE 表名 CHANGE 旧列名 新列名 数据类型;
-- 例如，将表名为"employees"的表中列名为"age"的列修改为"new_age"，数据类型为INT：
-- ALTER TABLE employees CHANGE age new_age INT;

-- 修改列备注
ALTER TABLE test01.Customer modify column referee_id int comment '推荐客户的id'


-- 新增
-- ALTER TABLE 表 ADD CONSTRAINT 约東名 FOREIGN KEY(作为外键的列)REFERENCES 哪个表(哪个字段)
-- # 删除外键
-- ALTER TABLE 表名 DROP FOREIGN KEY 外键名;

-- 创建索引
CREATE INDEX index_name ON table_name(column1, column2, ...);
-- 删除索引
DROP INDEX `index_name` ON `table_name`;
```


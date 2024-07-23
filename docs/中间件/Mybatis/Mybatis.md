# Mybatis

## 映射

```xml
<!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.onlinecourse.content.model.po.Teachplan">
        <id column="id" property="id"/>
        <result column="pname" property="pname"/>
        <result column="parentid" property="parentid"/>
        <result column="grade" property="grade"/>
        <result column="media_type" property="mediaType"/>
        <result column="start_time" property="startTime"/>
        <result column="end_time" property="endTime"/>
        <result column="description" property="description"/>
        <result column="timelength" property="timelength"/>
        <result column="orderby" property="orderby"/>
        <result column="course_id" property="courseId"/>
        <result column="course_pub_id" property="coursePubId"/>
        <result column="status" property="status"/>
        <result column="is_preview" property="isPreview"/>
        <result column="create_date" property="createDate"/>
        <result column="change_date" property="changeDate"/>
    </resultMap>
    <!-- 课程分类树型结构查询映射结果 -->
    <resultMap id="treeNodeResultMap" type="com.onlinecourse.content.model.dto.TeachplanDto">
        <!-- 一级数据映射 -->
        <id column="one_id" property="id"/>
        <result column="one_pname" property="pname"/>
        <result column="one_parentid" property="parentid"/>
        <result column="one_grade" property="grade"/>
        <result column="one_mediaType" property="mediaType"/>
        <result column="one_stratTime" property="startTime"/>
        <result column="one_endTime" property="endTime"/>
        <result column="one_orderby" property="orderby"/>
        <result column="one_courseId" property="courseId"/>
        <result column="one_coursePubId" property="coursePubId"/>
        <!-- 一级中包含多个二级数据 映射子节点，一对多映射 oftype list中的对象类型-->
        <collection property="teachPlanTreeNodes" ofType="com.onlinecourse.content.model.dto.TeachplanDto">
            <!-- 二级数据映射 -->
            <id column="two_id" property="id"/>
            <result column="two_pname" property="pname"/>
            <result column="two_parentid" property="parentid"/>
            <result column="two_grade" property="grade"/>
            <result column="two_mediaType" property="mediaType"/>
            <result column="two_stratTime" property="startTime"/>
            <result column="two_endTime" property="endTime"/>
            <result column="two_orderby" property="orderby"/>
            <result column="two_courseId" property="courseId"/>
            <result column="two_coursePubId" property="coursePubId"/>
            <association property="teachplanMedia" javaType="com.onlinecourse.content.model.po.TeachplanMedia">
                <result column="teachplanMeidaId" property="id"/>
                <result column="mediaFilename" property="mediaFilename"/>
                <result column="mediaId" property="mediaId"/>
                <result column="two_id" property="teachplanId"/>
                <result column="two_courseId" property="courseId"/>
                <result column="two_coursePubId" property="coursePubId"/>
            </association>
        </collection>
    </resultMap>
```


# @/client/
合并seats.status and notes.status into seats status
seats.user -> socket.user
socket.on('disconnect', {
  socket.user.status = 'left'
}) 
when isGameEndeProcess -> still show game results? once click waitOk ->
if anyone left, then kick every one out and put them back to room re-seat on table


显示过牌让牌状态


添加观战模式 when this.user.seat === -1



自动买3进贡([穿三胡分数加倍，自动会5])，询问是否买4，自动买4，每人只保留一张4

开点 红，打出4不开 绿 -》烧 闷

落第三名是红的？应该是紫的
弃4只能是4
烧牌button判定，抢夺出牌权


# @/server/core.js
头科走完，够级牌问对家，然后再出，然后头科状态变成了play在场上
烧成那段有bug？
添加出3之后一轮，下家接风
添加无级自开
添加冲锋模式


# @/server/db.js
添加数据库-用户 -> client添加注册/个人战绩查询
https://blog.jscrambler.com/vue-js-authentication-system-with-node-js-backend
https://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example


添加数据库-牌局


# @/client
添加够级规则介绍页面
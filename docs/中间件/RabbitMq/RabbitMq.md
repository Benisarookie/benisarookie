# RabbitMq

## 基本消息模型

![](C:\Users\Ben\AppData\Roaming\Typora\typora-user-images\image-20240625100702337.png)

```java
//绑定队列
@Configuration
public class RabbitMqConfig{
    private static final String QUEUE = "queue";
    
    @Bean
    public Queue queue(){
        return new Queue(QUEUE,true);//QUEUE队列名  true为可持久化
    }
}

@Service
public class MqSend{
    @Autowire
    RabbitTemplate rabbitTemplate;
    //发送消息
    public void send(Object msg){
        rabbitTemplate.convertAndSend("queue",msg);//"queue"为队列名称，msg为信息
    }   
    
}

@Service
public class MqReceiver{
    //接收消息
	@RabbitListener(queues = "queue")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
}

```



## Fanout模式（广播）

一个生产者发送消息到一个交换机，该交换机将消息广播给多个队列和多个消费者。这个模型允许一个消息被多个消费者接收。

```java
//绑定队列
@Configuration
public class RabbitMqConfig{
    private static final String QUEUE01 = "queue_fanout01";
    private static final String QUEUE02 = "queue_fanout02";
    private static final String EXCHANGE = "fanoutExchange";
    
    @Bean
    public Queue queue01(){
        return new Queue(QUEUE01);
    }
    @Bean
    public Queue queue01(){
        return new Queue(QUEUE01);
    }
    @Bean
    public FanoutExchange fanoutExchange(){
        return new FanoutExchange(EXCHANGE);
    }
    @Bean
    public Binding binding01(){
        return BindingBuilder.build(queue01()).to(fanoutExchange());
    }
    @Bean
    public Binding binding02(){
        return BindingBuilder.build(queue02()).to(fanoutExchange());
    }
}

//发送消息工具类
@Service
public class MqSend{
    @Autowire
    RabbitTemplate rabbitTemplate;
    //发送消息
    public void send(Object msg){
        rabbitTemplate.convertAndSend("fanoutExchange","",msg);//"fanoutExchange"为交换机，msg为信息
    }   
    
}
//接收消息类
@Service
public class MqReceiver{
    //接收消息
	@RabbitListener(queues = "queue_fanout01")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
	@RabbitListener(queues = "queue_fanout02")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
}
```

## Direct

在Direct模型下，队列与交换机的绑定，不能是任意绑定了，而是要指定一个RoutingKey（路由key），消息的发送方在向Exchange发送消息时，也必须指定消息的routing key。

```java
//绑定队列
@Configuration
public class RabbitMqConfig{
    private static final String QUEUE01 = "queue_direct01";
    private static final String QUEUE02 = "queue_direct02";
    private static final String EXCHANGE = "directExchange";
    private static final String ROUTINGKEY01 = "queque.red";
    private static final String ROUTINGKEY02 = "queque.green";
    
    @Bean
    public Queue queue01(){
        return new Queue(QUEUE01);
    }
    @Bean
    public Queue queue01(){
        return new Queue(QUEUE01);
    }
    @Bean
    public DirectExchange directExchange(){
        return new DirectExchange(EXCHANGE);
    }
    @Bean
    public Binding binding01(){
        //绑定队列queue_direct01到交换机directExchange上 路径键值为queque.red
        return BindingBuilder.build(queue01()).to(directExchange()).with(ROUTINGKEY01);
    }
    @Bean
    public Binding binding02(){
        //绑定队列queue_direct02到交换机directExchange上 路径键值为queque.green
        return BindingBuilder.build(queue02()).to(directExchange()).with(ROUTINGKEY02);
    }
}

//发送消息工具类
@Service
public class MqSend{
    @Autowire
    RabbitTemplate rabbitTemplate;
    //发送消息
    public void send(Object msg){
        //"directExchange"为交换机，"queque.red"为路径key，msg为信息
        rabbitTemplate.convertAndSend("directExchange","queque.red",msg);
    }   
    public void send(Object msg){
        //"directExchange"为交换机，"queque.green"为路径key，msg为信息
        rabbitTemplate.convertAndSend("directExchange","queque.green",msg);
    }  
    
}
//接收消息类
@Service
public class MqReceiver{
    //接收消息
	@RabbitListener(queues = "queue_direct01")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
	@RabbitListener(queues = "queue_direct02")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
}
```

## Topic

*匹配一个

\#匹配多个

```java
//绑定队列
@Configuration
public class RabbitMqConfig{
    private static final String QUEUE01 = "queue_topic01";
    private static final String QUEUE02 = "queue_topic02";
    private static final String EXCHANGE = "topicExchange";
    private static final String ROUTINGKEY01 = "#.queque.#";
    private static final String ROUTINGKEY02 = "*.queque.#";
    
    @Bean
    public Queue queue01(){
        return new Queue(QUEUE01);
    }
    @Bean
    public Queue queue01(){
        return new Queue(QUEUE01);
    }
    @Bean
    public TopicExchange topicExchange(){
        return new TopicExchange(EXCHANGE);
    }
    @Bean
    public Binding binding01(){
        //绑定队列queue_topic01到交换机directExchange上 路径键值为queque.red
        return BindingBuilder.build(queue01()).to(topicExchange()).with(ROUTINGKEY01);
    }
    @Bean
    public Binding binding02(){
        //绑定队列queue_topic02到交换机directExchange上 路径键值为queque.green
        return BindingBuilder.build(queue02()).to(topicExchange()).with(ROUTINGKEY02);
    }
}

//发送消息工具类
@Service
public class MqSend{
    @Autowire
    RabbitTemplate rabbitTemplate;
    //发送消息
    public void send(Object msg){
        //"directExchange"为交换机，"queque.red"为路径key，msg为信息
        //希望被第一个队列接收到
        rabbitTemplate.convertAndSend("topicExchange","queque.red.msg.xxx.xxx",msg);
    }   
    public void send(Object msg){
        //"directExchange"为交换机，"queque.green"为路径key，msg为信息
        //希望被两个队列接收到
        rabbitTemplate.convertAndSend("topicExchange","msg.queque.green.abc",msg);
    }  
    
}
//接收消息类
@Service
public class MqReceiver{
    //接收消息
	@RabbitListener(queues = "queue_direct01")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
	@RabbitListener(queues = "queue_direct02")
    public void receive(Object msg){
        //处理逻辑
        ...
    }
}
```


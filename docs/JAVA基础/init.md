# java基础

## 多线程

1.继承Thread方法实现多线程

```java
/**
 *  1，继承Thread方法实现多线程
 *
 *  Thread类是有run()方法的；也有start()方法
 *
 *  在锁方面，用synchronized不会有效
 */
public class BaseThreadFirstTest extends Thread {
    static ReentrantLock lock = new ReentrantLock(true);
    private AtomicInteger atomicInteger = new AtomicInteger();
    private int count ;
    @Override
    public  void run() {
        //加锁
        lock.lock();
        try {
            for (int i = 0; i < 5; i++) {
                System.out.println(count++);
            }
        } finally {
            System.out.println(this.getName()+"测试");
            //不管最后是否异常都进行锁的释放
            lock.unlock();//解锁
        }
    }

    public static void main(String[] args) {
        BaseThreadFirstTest baseThreadFirstTest = new BaseThreadFirstTest();
        BaseThreadFirstTest baseThreadFirstTest1 = new BaseThreadFirstTest();
        //start
        baseThreadFirstTest.start();
        baseThreadFirstTest1.start();
//        baseThreadFirstTest.run();
//        baseThreadFirstTest1.run();
    }
}
```

2.实现Runnable接口

```java
/**
 * 2.实现Runnable接口
 * 可以有效的共享资源  synchronized，lock都可以控制
 * 只有run方法没有start方法
 */
public class BaseThreadSecoTest implements Runnable{
    private int count;
    @Override
    public synchronized void run() {
        System.out.println(Thread.currentThread().getName());
        for (int i = 0; i < 5; i++) {
            System.out.println(count++);
        }
    }

    public static void main(String[] args) {
        BaseThreadSecoTest baseThreadFirstTest = new BaseThreadSecoTest();

        Thread thread = new Thread(baseThreadFirstTest, "一");
        Thread thread2 = new Thread(baseThreadFirstTest, "二");
        thread2.start();
        thread.start();

    }
}
```

3.实现Callable接口

```java
/**
 * 3.实现Callable接口
 * 有返回值
 *
 */
public class BaseThreadThirdTest implements Callable {

    private int i = 0;

    public static void main(String[] args) {
        BaseThreadThirdTest baseThreadThirdTest = new BaseThreadThirdTest();
        FutureTask ft = new FutureTask<>(baseThreadThirdTest);

        for (int i = 0; i < 100; i++) {
            System.out.println(Thread.currentThread().getName() + " " + i);
            if (i == 30) {
                //FutureTask对象作为Thread对象的target创建新的线程
                Thread thread = new Thread(ft);  
                //线程进入到就绪状态 还缺少cpu资源
                thread.start();                      
            }
        }

        System.out.println("主线程for循环执行完毕..");

        try {
            //取得新创建的新线程中的call()方法返回的结果
            int sum = (int) ft.get();            
            System.out.println("sum = " + sum);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Object call() throws Exception {
        int sum = 0;
        for (; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + " " + i);
            sum += i;
        }
        return sum;
    }
}
```

4.线程池创建多线程

```java
/**
 * 4.线程池创建多线程
 */
public class BaseThreadForthTest   {

    private static int POOL_NUM = Runtime.getRuntime().availableProcessors();

    public static void main(String[] args) {
        System.out.println("获取的线程数："+ POOL_NUM);

        //启动POOL_NUM个线程的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(POOL_NUM);

        for (int i = 0; i < POOL_NUM; i++) {
            RunnableThreadTest myThreadTest = new RunnableThreadTest();
            executorService.execute(myThreadTest);
        }
        //关闭线程池
        executorService.shutdown();
    }

    static class RunnableThreadTest implements Runnable{

        @Override
        public void run() {
            System.out.println("通过线程池方式创建的线程：" + Thread.currentThread().getName() + " ");
        }
    }

}
```

## ExecutorService

`ExecutorService` 是Java并发API中的核心接口之一，它提供了一个用于管理线程池的框架，允许你异步地执行任务。

以下是 `ExecutorService` 接口的常用方法以及它们的作用：

1. **submit(Runnable task)**:
   - 提交一个 `Runnable` 任务用于执行，返回一个 `Future<?>` 对象，可用于查询任务执行状态或者取消任务。
2. **submit(Callable task)**:
   - 提交一个 `Callable` 任务用于执行，它允许你返回结果，返回的 `Future<T>` 对象可以用来获取任务执行的结果。
3. **execute(Runnable command)**:
   - 执行一个 `Runnable` 任务，此方法没有返回值。如果需要跟踪任务是否执行完毕或取消任务，应当使用 `submit()` 方法。
4. **shutdown()**:
   - 开始一个优雅关闭的过程，不再接受新任务，但已提交的任务仍会继续执行。
5. **shutdownNow()**:
   - 尝试停止所有正在执行的任务，并返回等待执行的任务列表。这个方法不会等待正在执行的任务完成。
6. **isShutdown()**:
   - 查询线程池是否已经开始关闭。
7. **isTerminated()**:
   - 查询线程池中所有的任务是否都已完成结束。
8. **awaitTermination(long timeout, TimeUnit unit)**:
   - 等待直到所有提交的任务完成。可以指定一个超时时间，如果在超时时间内任务未完成，则返回 `false`。
9. **invokeAll(Collection<? extends Callable> tasks)**:
   - 执行给定的任务集合，如果任意任务未完成，则抛出 `InterruptedException`。
10. **invokeAny(Collection<? extends Callable> tasks)**:
    - 执行给定的任务集合中的任意一个任务，并返回计算结果。如果有任务因为异常而没有返回结果，则抛出执行期间遇到的异常。
11. **用途**:
    - 通常来说，如果你需要任务的结果或者对任务有额外的控制（如取消任务），应该使用 `submit()`。
    - 当你只关心任务的执行，而不关心其结果时，可以使用 `execute()`。

**submit()举例**

```java
public class ExecutorServiceSubmitExample {
    public static void main(String[] args) {
        // 创建一个固定大小的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(10);

        // 提交任务到线程池
        for (int i = 0; i < 10; i++) {
            int finalI = i; // 用于在 lambda 表达式中使用
            Future<?> future = executorService.submit(() -> {
                System.out.println("Task " + finalI + " executed by " + Thread.currentThread().getName());
                // 这里可以执行一些任务
            });
            // 未来我们可以用 future.get() 获取任务运行结果，或者使用 future.cancel(true) 取消任务
        }

        executorService.shutdown();
        while (!executorService.isTerminated()) {
            // 可以在这里等待所有任务完成，或者做其他事情
        }
        
        System.out.println("All tasks have been submitted and executed.");
    }
}
```

**excute()举例**

```java
public class ExecutorServiceExecuteExample {
    public static void main(String[] args) {
        // 创建一个固定大小的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(10);

        // 执行任务
        for (int i = 0; i < 10; i++) {
            executorService.execute(() -> {
                System.out.println("Task " + i + " executed by " + Thread.currentThread().getName());
                // 这里可以执行一些任务
            });
        }

        executorService.shutdown();
        try {
            // 等待所有任务执行完成
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                System.err.println("Lingering tasks will be cancelled.");
                executorService.shutdownNow(); // 如果超时，尝试立即取消正在执行的任务
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
        
        System.out.println("All tasks have been executed.");
    }
}
```

## CompletableFuture

`CompletableFuture` 是 Java 8 引入的一个类，它是 `Future` 接口的一个扩展实现，提供了一种异步编程的机制。它允许你以声明性和非阻塞的方式来处理异步的任务和操作。

**1.示例**

```java
public class CompletableFutureExample1 {
    public static void main(String[] args) throws InterruptedException {
        CompletableFuture.supplyAsync(() -> {
            // 模拟一个耗时任务
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "任务完成";
        }).thenAccept(result -> {
            System.out.println(result); // 打印结果
        }).exceptionally(ex -> {
            System.out.println("发生异常：" + ex.getMessage());
            return null;
        });
        // 主线程继续执行
        System.out.println("主线程正在做其他工作...");
    }
}
//在这个示例中，我们使用 supplyAsync() 来异步执行一个任务，这个任务在后台线程中执行，不会阻塞主线程。supplyAsync() 默认使用的是 ForkJoinPool.commonPool()，它根据需要动态扩展线程数量，最大并行度是 CPU 核心数。
```

**2.自定义线程池**

```java
public class CompletableFutureExample2 {
    public static void main(String[] args) {
        // 创建一个自定义的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(
                () -> {
                    System.out.println("任务1由线程 " + Thread.currentThread().getName() + " 执行");
                    return "结果1";
                }, executorService
        );

        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(
                () -> {
                    System.out.println("任务2由线程 " + Thread.currentThread().getName() + " 执行");
                    return "结果2";
                }, executorService
        );

        future1.thenAccept(result -> {
            System.out.println("任务1完成：" + result);
        });

        future2.thenAccept(result -> {
            System.out.println("任务2完成：" + result);
        });

        // 关闭线程池
        executorService.shutdown();
    }
}
```

**3.异步串行执行**

```java
public class CompletableFutureExample3 {
    public static void main(String[] args) {
        CompletableFuture<String> future = CompletableFuture.supplyAsync(
                () -> {
                    System.out.println("第一步 - 任务1");
                    return "结果1";
                }
        ).thenApply(result -> {
            System.out.println("第二步 - 任务2");
            return "结果2基于" + result;
        }).thenAccept(result -> {
            System.out.println("第三步 - 任务3: " + result);
        });

        // 等待所有任务完成
        fujoin();
    }
}
```

## 线程轮换输出字符串

```java
/**
*Thread 实现字符串轮训打印
**/
public class MultiThreadPrint extends Thread{
    static int index;
    static int maxCount;
    static AtomicInteger count; 
    static ReentrantLock lock = new ReentrantLock(true); //公平锁（线程依次执行）
    private int assign;  //控制指定线程运行  
    private Runnable action;

    public MultiThreadPrint(int assign,Runnable action){
        this.assign =assign;
        if (assign == index){
            this.assign = 0;
        }
        this.action = action; //初始化线程方法
    }
    @Override
    public void run(){
        while (count.get()<= maxCount){
            lock.lock();//上锁
            if (count.get() <= maxCount && count.get() % index == assign){
//                System.out.println(getName());
                this.action.run();
                count.incrementAndGet();  //原子操作保证数据一致性
            }
            lock.unlock();//解锁
        }
    }

    public static void main(String[] args) {
        MultiThreadPrint.index = 5; //5个线程交替打印
//        MultiThreadPrint.index = 2;
//        MultiThreadPrint.maxCount = 25;//每个线程打印25/5次
        MultiThreadPrint.maxCount = 100;//每个线程打印25/5次
        MultiThreadPrint.count = new AtomicInteger(1);

        //循环开两个线程
        for (int i = 1 ;i<=index;i++){
            final int assign = i;
            //初始化线程方法
            MultiThreadPrint t = new MultiThreadPrint(assign,()->{
                System.out.println(currentThread().getName()+":"+(char) ('A'+assign-1));
            });
            t.setName("线程"+i);
            t.start();
        }

    }
}
```

```java
/**
*ExecutorService   轮换输出打印字符串
**/
public class BaseThreadForthTest13 {
    //公平锁
    static ReentrantLock lock = new ReentrantLock(true);
//    static ReentrantLock lock = new ReentrantLock();
    //线程数
    private static int threadNum = 5;
    //最大打印总次数
    static int maxCount = 100;
    //打印总数
    static AtomicInteger count = new AtomicInteger(1);//初始化数据  （原子性操作）
    private int assign;

    public static void main(String[] args) {

        //创建线程数为threadNum的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(threadNum);
        for (int i = 0; i < threadNum; i++) {
            final int a =i;
            executorService.submit(()->{
                while (true){
                    if (count.get()>maxCount)break;
                    lock.lock();
                    try {
                        if (count.get()>maxCount)break;
                        System.out.println(Thread.currentThread().getName()+":"+(char)('A'+ a));
                        count.incrementAndGet();
                    }finally {
                        lock.unlock();
                    }
                }
            });
        }
        executorService.shutdown();
    }
}
```



## 测试玩玩
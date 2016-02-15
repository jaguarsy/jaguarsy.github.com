<p>今天看angular源码的时候, 发现在angular中创建map对象并不是直接用<code>var xxx = {}</code>的方式创建的, 而是专门调用了一个createMap函数.
抱着好奇的心态, 我找到了createMap函数声明的地方, 发现实际上这个函数是调用了<code>Object.create(null)</code>. 由于我从未用过这个方式创建对象, 看着有点云里雾里.
再看函数的注释, 上面写着:<code>Creates a new object without a prototype. This object is useful for lookup without having to 
guard against prototypically inherited properties via hasOwnProperty.</code>
再google了一发, 这才明白了其中缘由.
其实很简单😓.
看下面的代码:</p>
<pre><code>Object.prototype.test = 1;
var a = {};
var b = Object.create(null);
console.log(a.test) //1
console.log(b.test) //undefined
</code></pre><p>其实<code>var a = {}</code>就等同于<code>Object.create(Object.prototype);</code>, 因此第一种方式在创建一个map对象的时候存在隐患.</p>
<p>特此记录作为备忘.</p>

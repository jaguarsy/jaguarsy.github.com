<p>今天看angular源码的时候, 发现在angular中创建map对象并不是直接用<code><span class="hljs-keyword">var</span> xxx = {}</code>的方式创建的, 而是专门调用了一个createMap函数.
抱着好奇的心态, 我找到了createMap函数声明的地方, 发现实际上这个函数是调用了<code>Object.<span class="hljs-function"><span class="hljs-title">create</span><span class="hljs-params">(null)</span></span></code>. 由于我从未用过这个方式创建对象, 看着有点云里雾里.
再看函数的注释, 上面写着:<code>Creates <span class="hljs-tag">a</span> new <span class="hljs-tag">object</span> without <span class="hljs-tag">a</span> prototype. This <span class="hljs-tag">object</span> is useful <span class="hljs-keyword">for</span> lookup without having to 
guard against prototypically inherited properties via hasOwnProperty.</code>
再google了一发, 这才明白了其中缘由.
其实很简单😓.
看下面的代码:</p>
<pre><code><span class="hljs-built_in">Object</span>.prototype.test = <span class="hljs-number">1</span>;
<span class="hljs-keyword">var</span> a = {};
<span class="hljs-keyword">var</span> b = <span class="hljs-built_in">Object</span>.create(<span class="hljs-literal">null</span>);
<span class="hljs-built_in">console</span>.log(a.test) <span class="hljs-comment">//1</span>
<span class="hljs-built_in">console</span>.log(b.test) <span class="hljs-comment">//undefined</span>
</code></pre><p>其实<code><span class="hljs-keyword">var</span> a = {}</code>就等同于<code><span class="hljs-built_in">Object</span>.create(<span class="hljs-built_in">Object</span>.prototype);</code>, 因此第一种方式在创建一个map对象的时候存在隐患.</p>
<p>特此记录作为备忘.</p>

# Cached APIs with Express and Redis
Contains source code for a simple RESTful Webservice which utilises redis for caching the results.

### Installation
```
npm install
```

### External dependencies
> Needs Redis server running on localhost on the default port (6379).
>
> Needs Mongo running on local/cloud (Significant improvement (more than 27x calls) on cloud because of internet latency).


## Benchmarks
### System configuration
&nbsp;
**OS:** Windows 10 Pro 64-bit (10.0, Build 17763)

&nbsp;
**Processor:** Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz, 1992 Mhz, 4 Core(s), 8 Logical Processor(s)


&nbsp;
**Memory:** 16.0 GB


&nbsp;
**Node version**: v8.11.1


&nbsp;
**MongoDB version**: v4.0.8


&nbsp;
**Redis version**: v3.0.503


### Steps:
>  1. Spin up the application.
>  2. Perform ```POST http://<host>:4000``` with body of form ```{"field_1":<Some string value>,"field_2":<Some string value>,"array_1":[<Some values>]}```. I posted 150 values for this test.
>  3. Perform ```GET http://<host>:4000?skip=<number of items to skip>&limit=<limit of number of result>``` in pair for multiple (skip, limit) tuples and time the results.


## Results
> **Following are the average results for 100 pairs of get queries done before and after caching when Mongo is running locally:**

**Total time taken to fetch before caching:** 4834ms<br>
**Total time taken to fetch after caching:** 918ms
<br><br>
**Average time per query before caching:** 48.34ms<br>
**Average time per query after caching:** 9.18ms
<br><br><br>
**Time reduced in retrieval after caching:** 81.00%

## Disclaimer
These benchmarks, in no way, generalise/guarantee performance improvement after caching.
> 

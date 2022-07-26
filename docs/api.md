# api列表

## 查询商店信息

``` 
[GET] /api/shops?shop={name}
```

响应格式
``` json
{
  "code": 200,
  "data": [
    {
      "id": 2,
      "name": "鱼",
      "price": 10,
      "count": 5,
      "pic": {
        "has": false
      }
    }
  ]
}
```
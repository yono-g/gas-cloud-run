# GAS + Cloud Run

GASとCloud Runの連携サンプル

```
       createTask             HTTP Targetタスク            
[ GAS ] --------> [ CloudTasks ] --------> [ CloudRun ]
   ↑                                            |
   ----------------------------------------------
                     doPost
```

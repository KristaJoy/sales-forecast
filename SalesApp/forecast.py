from .app import db

from sqlalchemy.sql import text


#Return data 
def get_region(region):

    # all the data
    if region == "National":
        sales = db.engine.execute(text('SELECT order_id, order_date, customer_id, segment, city, state, region, product_id, category, subcategory, product_name, sales FROM sales'))
        
        sales_data = []
        for s in sales:
            salesdict = {'order_id':s[0],'order_date':s[1],'customer_id':s[2],'segment':s[3],'city':s[4],'state':s[5],'region':s[6],'product_id':s[7],'category':s[8],'subcategory':s[9],'product_name':s[10],'sales':s[11] }
            sales_data.append(salesdict)

        
    # filtered by region
    else:
        sales = db.engine.execute(text('SELECT order_id, order_date, customer_id, segment, city, state, region, product_id, category, subcategory, product_name, sales FROM sales WHERE region = :val'), val = region)
        
        sales_data = []
        for s in sales:
            salesdict = {'order_id':s[0],'order_date':s[1],'customer_id':s[2],'segment':s[3],'city':s[4],'state':s[5],'region':s[6],'product_id':s[7],'category':s[8],'subcategory':s[9],'product_name':s[10],'sales':s[11] }
            sales_data.append(salesdict)

    
    return sales_data


#Return forecast data 
# def get_forecast(region):

#     # all the data
#     if region == "National":
#         sales = db.engine.execute(text('SELECT order_id, order_date, customer_id, segment, city, state, region, product_id, category, subcategory, product_name, sales FROM sales'))
        
#         sales_data = []
#         for s in sales:
#             salesdict = {'order_id':s[0],'order_date':s[1],'customer_id':s[2],'segment':s[3],'city':s[4],'state':s[5],'region':s[6],'product_id':s[7],'category':s[8],'subcategory':s[9],'product_name':s[10],'sales':s[11] }
#             sales_data.append(salesdict)

        
#     # filtered by region
#     else:
#         sales = db.engine.execute(text('SELECT order_id, order_date, customer_id, segment, city, state, region, product_id, category, subcategory, product_name, sales FROM sales WHERE region = :val'), val = region)
        
#         sales_data = []
#         for s in sales:
#             salesdict = {'order_id':s[0],'order_date':s[1],'customer_id':s[2],'segment':s[3],'city':s[4],'state':s[5],'region':s[6],'product_id':s[7],'category':s[8],'subcategory':s[9],'product_name':s[10],'sales':s[11] }
#             sales_data.append(salesdict)

    
#     return forecast_data
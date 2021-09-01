from .app import db

from sqlalchemy.sql import text


#Return raw sales data 
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


#Return ml data by REGION

def get_mlregion(region):

    # filtered by region
    mlregion = db.engine.execute(text('SELECT date, yhat, region FROM regions WHERE region = :val'), val = region)
        
    mlregion_data = []
    for m in mlregion:
        mlregiondict = {'date':m[0],'yhat':m[1],'region':m[2]}
        mlregion_data.append(mlregiondict)

    
    return mlregion_data

#Return ml data by CATEGORY

def get_mlcategory(category):

    # filtered by category
    mlcategory = db.engine.execute(text('SELECT date, yhat, region, category FROM categories WHERE category = :val'), val = category)
        
    mlcat_data = []
    for c in mlcategory:
        mlcatdict = {'date':c[0],'yhat':c[1],'region':c[2],'category':c[3]}
        mlcat_data.append(mlcatdict)

    
    return mlcat_data
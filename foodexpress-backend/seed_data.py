import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodexpress.settings')
django.setup()

from django.apps import apps
from django.contrib.auth import get_user_model

User = get_user_model()
RestaurantProfile = apps.get_model('restaurants', 'RestaurantProfile')
MenuItem = apps.get_model('restaurants', 'MenuItem')

# Check available fields in RestaurantProfile
profile_fields = [f.name for f in RestaurantProfile._meta.get_fields()]
menu_fields = [f.name for f in MenuItem._meta.get_fields()]

def seed_database():
    print("Seeding Top Restaurants & Menus...")

    restaurants_data = [
        {
            "owner_username": "thalappakatti_owner",
            "name": "Dindigul Thalappakatti",
            "address": "100 Feet Road, Velachery, Chennai",
            "dishes": [
                {"name": "Thalappakatti Mutton Biryani", "description": "Authentic seeraga samba mutton biryani with rich spices", "price": 340},
                {"name": "Thalappakatti Chicken Biryani", "description": "Signature chicken biryani served with raita and dalcha", "price": 280},
                {"name": "Mutton Chukka", "description": "Tender pan-fried mutton with crushed pepper & shallots", "price": 310},
                {"name": "Black Pepper Chicken Fry", "description": "Spicy dry chicken roast with fresh black pepper", "price": 260},
                {"name": "Parotta (2 Pcs) with Salna", "description": "Flaky layered parotta with aromatic non-veg salna", "price": 90},
                {"name": "Jigarthanda Special", "description": "Traditional Madurai chilled dessert drink with badam pisin", "price": 110},
            ]
        },
        {
            "owner_username": "sangeetha_owner",
            "name": "Sangeetha Veg Restaurant",
            "address": "GN Chetty Road, T. Nagar, Chennai",
            "dishes": [
                {"name": "Special Ghee Podi Dosa", "description": "Crispy golden dosa generously topped with spicy podi & desi ghee", "price": 130},
                {"name": "Medu Vada (2 Pcs) with Sambar", "description": "Crispy lentil fritters served with coconut chutney & piping hot sambar", "price": 80},
                {"name": "South Indian Mini Meals", "description": "Sambar rice, curd rice, poriyal, kootu, appalam & sweet", "price": 180},
                {"name": "Paneer Butter Masala", "description": "Cottage cheese cubes simmered in rich creamy tomato gravy", "price": 220},
                {"name": "Butter Naan (2 Pcs)", "description": "Soft clay-oven baked flatbread brushed with butter", "price": 95},
                {"name": "Filter Coffee (Degree)", "description": "Freshly brewed authentic South Indian filter coffee", "price": 45},
            ]
        },
        {
            "owner_username": "buhari_owner",
            "name": "Buhari Hotel Since 1951",
            "address": "Anna Salai, Mount Road, Chennai",
            "dishes": [
                {"name": "Original Buhari Chicken 65", "description": "The legendary recipe invented at Buhari in 1965", "price": 250},
                {"name": "Buhari Special Chicken Biryani", "description": "Classic Chennai style basmati chicken biryani with boiled egg", "price": 290},
                {"name": "Mutton Ceylon Parotta", "description": "Stuffed minced mutton layered bread cooked to golden perfection", "price": 240},
                {"name": "Dragon Chicken Starter", "description": "Crispy batter-fried chicken tossed in fiery spicy sweet sauce", "price": 270},
                {"name": "Buhari Special Falooda", "description": "Layered ice cream dessert with basil seeds, vermicelli & dry fruits", "price": 160},
            ]
        },
        {
            "owner_username": "kuppanna_owner",
            "name": "Junior Kuppanna",
            "address": "2nd Avenue, Anna Nagar, Chennai",
            "dishes": [
                {"name": "Kongu Mutton Biryani", "description": "Authentic Kongu style aroma-packed mutton biryani", "price": 350},
                {"name": "Nalli Fry (Mutton Shank)", "description": "Slow cooked juicy bone marrow shank roast", "price": 380},
                {"name": "Pallipalayam Chicken", "description": "Famous Erode style chicken cooked with shallots and dry red chillies", "price": 270},
                {"name": "Kothu Parotta (Egg & Chicken)", "description": "Shredded parotta tossed on tawa with chicken gravy, egg & spices", "price": 210},
                {"name": "Elaneer Payasam", "description": "Tender coconut milk pudding served chilled", "price": 120},
            ]
        },
        {
            "owner_username": "toscano_owner",
            "name": "Toscano Italian Pizzeria",
            "address": "Kader Nawaz Khan Road, Nungambakkam, Chennai",
            "dishes": [
                {"name": "Margherita Gourmet Pizza (11 inch)", "description": "San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil", "price": 390},
                {"name": "Peri Peri Paneer Pizza", "description": "Fiery peri peri spiced paneer, bell peppers, mozzarella", "price": 440},
                {"name": "Creamy Alfredo Penne Pasta", "description": "Penne in rich parmesan cream sauce with mushrooms & herbs", "price": 320},
                {"name": "Cheesy Garlic Bread Sticks", "description": "Baked sourdough sticks loaded with garlic butter and melted cheese", "price": 160},
                {"name": "Classic Tiramisu", "description": "Italian espresso-soaked ladyfingers with mascarpone cocoa cream", "price": 220},
            ]
        }
    ]

    for data in restaurants_data:
        owner_user, _ = User.objects.get_or_create(
            username=data["owner_username"],
            defaults={'email': f"{data['owner_username']}@foodexpress.com", 'role': 'restaurant'}
        )
        if not owner_user.password:
            owner_user.set_password('password123')
            owner_user.save()

        # Build dynamic payload matching exact model fields
        res_defaults = {}
        if "name" in profile_fields:
            res_defaults["name"] = data["name"]
        if "restaurant_name" in profile_fields:
            res_defaults["restaurant_name"] = data["name"]
        if "address" in profile_fields:
            res_defaults["address"] = data["address"]

        restaurant, created = RestaurantProfile.objects.get_or_create(
            owner=owner_user,
            defaults=res_defaults
        )
        if not created:
            for k, v in res_defaults.items():
                setattr(restaurant, k, v)
            restaurant.save()

        # Insert Menu items
        for dish in data["dishes"]:
            item_defaults = {"price": dish["price"]}
            if "description" in menu_fields:
                item_defaults["description"] = dish["description"]
            if "is_available" in menu_fields:
                item_defaults["is_available"] = True

            # Match Foreign Key name
            fk_field = "restaurant" if "restaurant" in menu_fields else "restaurant_profile"

            MenuItem.objects.get_or_create(
                name=dish["name"],
                **{fk_field: restaurant},
                defaults=item_defaults
            )

    print("\n✅ Successfully added all 5 Top Restaurants and 30+ Menu Items!")

if __name__ == '__main__':
    seed_database()
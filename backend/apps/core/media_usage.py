"""Reverse-lookup: given a Media record, find every real content location
that currently points at its URL. Used to show "used in" on the Media
Library and to warn before deleting a file that's actively referenced.

This is a live query, not a cached/fake label -- every field checked here
is a real CharField/FK that the public frontend actually renders from.
"""

from __future__ import annotations


def find_usage(media) -> list[dict]:
    from apps.cms.models import BlogPost, SEOSetting, SiteImageSlot, SiteSettings, Testimonial
    from apps.gallery.models import GalleryItem
    from apps.menu.models import DishGalleryImage, MenuItem

    url = media.file.url
    usage: list[dict] = []

    for item in MenuItem.objects.filter(image=url):
        usage.append({"location": f"منو → {item.name}", "field": "تصویر اصلی"})
    for item in MenuItem.objects.filter(plate_image=url):
        usage.append({"location": f"منو → {item.name}", "field": "تصویر بشقاب"})
    for item in MenuItem.objects.filter(anatomy_image=url):
        usage.append({"location": f"منو → {item.name}", "field": "تصویر آناتومی غذا"})
    for item in MenuItem.objects.filter(process_image=url):
        usage.append({"location": f"منو → {item.name}", "field": "تصویر مراحل پخت"})
    for gallery_image in DishGalleryImage.objects.filter(src=url).select_related("menu_item"):
        usage.append({"location": f"منو → {gallery_image.menu_item.name}", "field": "گالری غذا"})

    for item in GalleryItem.objects.filter(image=url):
        usage.append({"location": "گالری", "field": item.title or f"مورد #{item.pk}"})

    for post in BlogPost.objects.filter(cover_image=url):
        usage.append({"location": "وبلاگ", "field": post.title})

    for setting in SiteSettings.objects.filter(logo_url=url):
        usage.append({"location": "تنظیمات سایت", "field": "لوگو"})

    for seo in SEOSetting.objects.filter(og_image=url):
        usage.append({"location": "سئو", "field": f"{seo.get_page_key_display()} → تصویر Open Graph"})
    for seo in SEOSetting.objects.filter(twitter_image=url):
        usage.append({"location": "سئو", "field": f"{seo.get_page_key_display()} → تصویر توییتر"})

    for testimonial in Testimonial.objects.filter(avatar=url):
        usage.append({"location": "نظرات مشتریان", "field": testimonial.name})

    for slot in SiteImageSlot.objects.filter(media=media):
        usage.append({"location": "تصاویر سایت", "field": slot.label})

    return usage

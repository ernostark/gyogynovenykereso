import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RelatedContentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Kapcsolódó termékek keresése cikk alapján
   * @param post A cikk, amihez kapcsolódó termékeket keresünk
   * @returns Observable a kapcsolódó termékekkel
   */
  getRelatedProductsForPost(post: any): Observable<any[]> {
    if (!post || !post.diseases || post.diseases.length === 0) {
      return of([]);
    }

    let diseases: string[] = [];
    if (typeof post.diseases === 'string') {
      try {
        diseases = JSON.parse(post.diseases);
      } catch (e) {
        diseases = [post.diseases];
      }
    } else {
      diseases = post.diseases;
    }

    if (diseases.length === 0) {
      return of([]);
    }

    return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
      map(products => {
        return this.filterRelatedProducts(products, diseases);
      }),
      catchError(error => {
        console.error('Hiba a kapcsolódó termékek lekérésekor:', error);
        return of([]);
      })
    );
  }

  /**
   * Kapcsolódó cikkek keresése termék alapján
   * @param product A termék, amihez kapcsolódó cikkeket keresünk
   * @returns Observable a kapcsolódó cikkekkel
   */
  getRelatedPostsForProduct(product: any): Observable<any[]> {
    if (!product || !product.usage) {
      return of([]);
    }

    return this.http.get<{ success: boolean, posts: any[] }>(
      `${this.apiUrl}/public-posts`
    ).pipe(
      map(response => {
        if (response.success) {
          return this.filterRelatedPosts(response.posts, product.usage);
        }
        return [];
      }),
      catchError(error => {
        console.error('Hiba a kapcsolódó cikkek lekérésekor:', error);
        return of([]);
      })
    );
  }

  private filterRelatedProducts(products: any[], diseases: string[]): any[] {
    if (!products || products.length === 0 || !diseases || diseases.length === 0) {
      return [];
    }

    return products.filter(product => {
      if (!product.usage) return false;

      const usageText = product.usage.toLowerCase();
      return diseases.some(disease => {
        const diseaseLower = disease.toLowerCase();
        return usageText.includes(diseaseLower);
      });
    }).slice(0, 4);
  }

  private filterRelatedPosts(posts: any[], usageText: string): any[] {
    if (!posts || posts.length === 0 || !usageText) {
      return [];
    }

    const usageLower = usageText.toLowerCase();
    const keywords = usageLower
      .split(/\s+/)
      .filter(word => word.length > 4)
      .map(word => word.replace(/[^\p{L}\p{N}]/gu, ''))
      .filter(word => word.length > 0);

    if (keywords.length === 0) {
      return [];
    }

    return posts.filter(post => {
      if (!post.diseases) return false;

      let diseases: string[] = [];
      if (typeof post.diseases === 'string') {
        try {
          diseases = JSON.parse(post.diseases);
        } catch (e) {
          diseases = [post.diseases];
        }
      } else {
        diseases = post.diseases;
      }

      if (diseases.length === 0) return false;

      return diseases.some(disease => {
        const diseaseLower = disease.toLowerCase();
        return keywords.some(keyword => diseaseLower.includes(keyword));
      });
    }).slice(0, 3);
  }
}
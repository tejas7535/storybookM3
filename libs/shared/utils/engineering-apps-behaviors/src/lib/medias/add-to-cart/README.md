# Add to cart service 

The add to cart service utilizes event based communication with the embedding medias webpage. 
Since webcomponent events are handled on an app component level, handling the cart events there is also required
For this, the `cartEvents$` stream can be used.

Code sample
```typescript
// Naming of this output is important, since medias listens to the events
@Output() addToCart = new EventEmitter<AddToCartEvent>();

ngOnInit() {
  this.addToCartService.cartEvents$.subscribe((event) => this.addToCart.emit(event));
}
```

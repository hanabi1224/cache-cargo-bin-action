# cache-cargo-bin-action

This action caches binaries installed via `cargo install`

# Usage

```yaml
- uses: hanabi1224/cache-cargo-bin-action@v1.0.0
- run: cargo install --locked [bins]
  # This flag makes the binaries much smaller
  env:
    RUSTFLAGS: "-Cstrip=symbols"
```

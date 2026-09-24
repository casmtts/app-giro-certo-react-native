package br.com.girocerto.api.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "motorcycles")
public class Motorcycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String brand;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(length = 120)
    private String version;

    @Column(name = "model_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer mileage;

    @Column(name = "displacement_cc", nullable = false)
    private Integer displacementCc;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 24)
    private String category;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Column(name = "seller_type", nullable = false, length = 16)
    private String sellerType;

    @Column(name = "seller_name", nullable = false, length = 120)
    private String sellerName;

    @Column(name = "verified_seller", nullable = false)
    private boolean verifiedSeller;

    @Column(nullable = false, length = 1200)
    private String description;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "motorcycle_photos", joinColumns = @JoinColumn(name = "motorcycle_id"))
    @OrderColumn(name = "display_order")
    @Column(name = "photo_url", nullable = false, length = 500)
    private List<String> imageUrls = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Motorcycle() {
    }

    public Motorcycle(
            String brand,
            String model,
            String version,
            Integer year,
            Integer mileage,
            Integer displacementCc,
            BigDecimal price,
            String category,
            String city,
            String state,
            String sellerType,
            String sellerName,
            boolean verifiedSeller,
            String description,
            String imageUrl
    ) {
        this.brand = brand;
        this.model = model;
        this.version = version;
        this.year = year;
        this.mileage = mileage;
        this.displacementCc = displacementCc;
        this.price = price;
        this.category = category;
        this.city = city;
        this.state = state;
        this.sellerType = sellerType;
        this.sellerName = sellerName;
        this.verifiedSeller = verifiedSeller;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public Motorcycle(
            String brand,
            String model,
            String version,
            Integer year,
            Integer mileage,
            Integer displacementCc,
            BigDecimal price,
            String category,
            String city,
            String state,
            String sellerType,
            String sellerName,
            boolean verifiedSeller,
            String description,
            String imageUrl,
            List<String> imageUrls
    ) {
        this(brand, model, version, year, mileage, displacementCc, price, category, city, state,
                sellerType, sellerName, verifiedSeller, description, imageUrl);
        if (imageUrls != null) {
            this.imageUrls.addAll(imageUrls);
        }
    }

    @PrePersist
    void beforeInsert() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public String getVersion() { return version; }
    public Integer getYear() { return year; }
    public Integer getMileage() { return mileage; }
    public Integer getDisplacementCc() { return displacementCc; }
    public BigDecimal getPrice() { return price; }
    public String getCategory() { return category; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getSellerType() { return sellerType; }
    public String getSellerName() { return sellerName; }
    public boolean isVerifiedSeller() { return verifiedSeller; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public List<String> getImageUrls() { return List.copyOf(imageUrls); }
    public Instant getCreatedAt() { return createdAt; }
}

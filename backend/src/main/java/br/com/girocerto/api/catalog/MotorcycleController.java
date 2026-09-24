package br.com.girocerto.api.catalog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/motorcycles")
public class MotorcycleController {
    private final MotorcycleService motorcycleService;
    private final ListingCreationService listingCreationService;

    public MotorcycleController(MotorcycleService motorcycleService, ListingCreationService listingCreationService) {
        this.motorcycleService = motorcycleService;
        this.listingCreationService = listingCreationService;
    }

    @GetMapping
    List<MotorcycleResponse> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(required = false) Integer minCc,
            @RequestParam(required = false) Integer maxCc,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state
    ) {
        return motorcycleService.search(
                q, category, brand, minPrice, maxPrice,
                yearFrom, yearTo, minCc, maxCc, maxMileage, city, state
        );
    }

    @GetMapping("/{id}")
    MotorcycleResponse get(@PathVariable Long id) {
        return motorcycleService.get(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    MotorcycleResponse create(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CreateMotorcycleRequest request
    ) {
        return listingCreationService.create(userId, request);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    MotorcycleResponse createWithPhotos(
            @AuthenticationPrincipal Long userId,
            @Valid @ModelAttribute CreateMotorcycleRequest request,
            @RequestParam(name = "photos", required = false) List<MultipartFile> photos
    ) {
        return listingCreationService.create(userId, request, photos);
    }
}
